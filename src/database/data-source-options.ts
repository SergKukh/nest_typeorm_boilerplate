import { environment } from 'database/common/environment';
import { join } from 'path';
import type { DataSourceOptions } from 'typeorm';
import { MIGRATIONS_TABLE_NAME } from 'database/common/constants/migrations-table-name.const';

const {
  DB_HOST,
  DB_PORT,
  DB_DATABASE,
  DB_USERNAME,
  DB_PASSWORD,
  isDevelopment,
} = environment;

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT,
  database: DB_DATABASE,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  entities: [join(__dirname, '../**/*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations/*.{ts,js}')],
  migrationsTableName: MIGRATIONS_TABLE_NAME,
  migrationsRun: !isDevelopment,
  ...(!isDevelopment && { ssl: { rejectUnauthorized: false } }),
};
