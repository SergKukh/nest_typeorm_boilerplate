import {
  DeleteObjectsCommand,
  GetObjectCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Inject, Injectable, Logger } from '@nestjs/common';
import type { HashOptions } from 'node:crypto';
import { createHash } from 'node:crypto';
import { format, parse } from 'node:path';
import { Readable } from 'node:stream';
import { MODULE_OPTIONS_TOKEN } from 'modules/storage/storage.module-definition';
import { StorageModuleConfig } from 'modules/storage/types/storage-module-config.type';
import { DeletionFailedException } from 'modules/storage/exceptions/deletion-failed.exception';
import { UploadFailedException } from 'modules/storage/exceptions/upload-failed.exception';
import { SIGNED_URL_EXPIRATION } from 'common/constants/app';

@Injectable()
export class StorageService {
  constructor(
    @Inject(MODULE_OPTIONS_TOKEN) private readonly options: StorageModuleConfig,
  ) {}

  private readonly logger = new Logger(StorageService.name);

  private readonly s3 = new S3Client({
    region: this.options.awsS3Region,
    credentials: {
      accessKeyId: this.options.awsAccessKeyId,
      secretAccessKey: this.options.awsSecretAccessKey,
    },
  });

  private withGlobalPrefix(fileKey: string): string {
    const fileKeyWithGlobalPrefix = this.options.globalPrefix
      ? `${this.options.globalPrefix}/${fileKey}`
      : fileKey;

    return fileKeyWithGlobalPrefix;
  }

  private async getFileHash(
    file: Buffer | Readable,
    hashOptions?: HashOptions,
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const stream = file instanceof Readable ? file : Readable.from(file);
      const hash = createHash('md5', hashOptions);

      stream.on('data', (chunk) => hash.update(chunk));

      stream.on('end', () => {
        const fileHash = hash.digest('hex');

        resolve(fileHash);
      });

      stream.on('error', (err) => reject(err));
    });
  }

  async upload(
    filePath: string,
    buffer: Buffer,
    preserveFileName: boolean = false,
  ): Promise<string> {
    try {
      let fileKey: string = filePath;

      if (!preserveFileName) {
        const timestamp = Date.now();
        const fileHash = await this.getFileHash(buffer);
        const parsedFilePath = parse(filePath);
        const { name: fileName } = parsedFilePath;

        fileKey = format({
          ...parsedFilePath,
          base: undefined,
          name: `${fileName}-${fileHash}-${timestamp}`,
        });
      }

      const fileKeyWithGlobalPrefix = this.withGlobalPrefix(fileKey);

      const command = new PutObjectCommand({
        Bucket: this.options.awsS3Bucket,
        Key: fileKeyWithGlobalPrefix,
        Body: buffer,
      });

      await this.s3.send(command);

      return fileKeyWithGlobalPrefix;
    } catch (error) {
      throw new UploadFailedException(filePath, { cause: error });
    }
  }

  async delete(fileKey: string | string[]): Promise<void> {
    const fileKeys = Array.isArray(fileKey) ? fileKey : [fileKey];

    try {
      const command = new DeleteObjectsCommand({
        Bucket: this.options.awsS3Bucket,
        Delete: { Objects: fileKeys.map((Key) => ({ Key })) },
      });

      await this.s3.send(command);
    } catch (error) {
      throw new DeletionFailedException(fileKeys, { cause: error });
    }
  }

  async deleteByPrefix(prefix: string): Promise<void> {
    const prefixWithGlobalPrefix = this.withGlobalPrefix(prefix);

    const command = new ListObjectsCommand({
      Bucket: this.options.awsS3Bucket,
      Prefix: prefixWithGlobalPrefix,
    });

    const { Contents: files } = await this.s3.send(command);

    const fileKeys = files
      ?.map((f) => f.Key)
      .filter((f): f is string => typeof f === 'string');

    if (fileKeys) await this.delete(fileKeys);
  }

  async getSignedUrl(fileKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.options.awsS3Bucket,
      Key: fileKey,
    });

    const signedUrl = await getSignedUrl(this.s3, command, {
      expiresIn: SIGNED_URL_EXPIRATION,
    });

    return signedUrl;
  }
}
