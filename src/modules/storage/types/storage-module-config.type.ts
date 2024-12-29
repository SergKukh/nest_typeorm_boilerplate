export type StorageModuleConfig = {
  awsS3Bucket: string;
  awsS3Region: string;
  awsSecretAccessKey: string;
  awsAccessKeyId: string;
  globalPrefix?: string;
};
