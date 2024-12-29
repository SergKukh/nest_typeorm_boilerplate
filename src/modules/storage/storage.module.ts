import { Module } from '@nestjs/common';
import { StorageService } from 'modules/storage/storage.service';
import { ConfigurableModuleClass } from 'modules/storage/storage.module-definition';

@Module({
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule extends ConfigurableModuleClass {}
