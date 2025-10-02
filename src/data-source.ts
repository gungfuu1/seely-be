import { config } from 'dotenv'
import { DataSource, DataSourceOptions } from 'typeorm';

config();

export const dataSourceOpts: DataSourceOptions = {
  type: 'postgres',
  logging: true,
  url: process.env.DATABASE_URL,
  synchronize: false,
  entities: ["dist/**/*.entity.js"], 
  migrations: ["dist/migrations/*.js"],
}

export const AppDataSource = new DataSource(dataSourceOpts);