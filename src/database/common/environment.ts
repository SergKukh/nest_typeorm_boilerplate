import { config } from 'dotenv';
import { environmentValidator } from 'environment/environment.validator';
import { env } from 'process';

config();

export const environment = environmentValidator(env);
