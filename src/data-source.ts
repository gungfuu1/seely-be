import { config } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm';

config();

export const dataSourceOpts: DataSourceOptions = {
  type: 'postgres',
  logging: true,
  url: process.env.DATABASE_URL,
  synchronize: false,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
}

export const AppDataSource = new DataSource(dataSourceOpts);