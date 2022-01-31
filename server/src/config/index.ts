import dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

try {
  dotenv.config();
} catch (e) {
  console.log(e);
  throw e;
}

const ormConfig: ConnectionOptions = {
  type: 'postgres',
  host: 'db',
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  dropSchema: true,
  entities: ['src/entity/**/*.ts'],
  migrations: ['src/migration/**/*.ts'],
  subscribers: ['src/subscriber/**/*.ts']
};

export default {
  httpPort: Number(process.env.HTTP_PORT),
  apiPrefix: '/api',
  ormConfig
};
