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
  host: 'postgres',
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
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
  ormConfig,
  secret: {
    session: process.env.SESSION_SECRET ?? 'session-secret',
    kakao: {
      clientID: process.env.KAKAO_CLIENT_ID ?? 'kakao-client-id',
      clientSecret: process.env.KAKAO_CLIENT_SECRET ?? 'kakao-client-secret',
      callbackUrl: process.env.KAKAO_CALLBACK_URL ?? 'kakao-client-url'
    }
  }
};
