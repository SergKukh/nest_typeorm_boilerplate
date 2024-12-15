import { Global, Module } from '@nestjs/common';
import { Cacheable } from 'cacheable';
import KeyvRedis from '@keyv/redis';
import { ConfigService } from '@nestjs/config';
import { Env } from 'environment/environment.type';
import { CACHE_INSTANCE_NAME } from 'modules/cache/constants/cache-instance-name.const';
import { CacheService } from 'modules/cache/cache.service';

@Global()
@Module({
  providers: [
    {
      provide: CACHE_INSTANCE_NAME,
      useFactory: (configService: ConfigService<Env, true>): Cacheable => {
        const host = configService.get('REDIS_HOST', { infer: true });
        const port = configService.get('REDIS_PORT', { infer: true });
        const password = configService.get('REDIS_PASSWORD', { infer: true });
        const secondary = new KeyvRedis(`redis://:${password}@${host}:${port}`);

        return new Cacheable({ secondary });
      },
      inject: [ConfigService],
    },
    CacheService,
  ],
  exports: [CacheService],
})
export class CacheModule {}
