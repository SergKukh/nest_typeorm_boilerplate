import type { environmentSchema } from 'environment/environment.schema';
import type { z } from 'zod';

export type Env = z.infer<typeof environmentSchema> & {
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
};
