// eslint-disable
import http from 'http';
import express, { Express } from 'express';
import { Server as IOServer } from 'socket.io';
import { Connection, createConnection } from 'typeorm';
import session from 'express-session';
import cors from 'cors';

import passport from 'passport';

import initializePassport from './passport';
import config from './config';
import GameManager from './managers/gameManager';
import mainRouter from './routes';
import SessionEntity from './entity/session.entity';
import { TypeormStore } from 'typeorm-store';

class Server {
  public httpServer: http.Server;
  public app: Express;
  public io: IOServer;
  public managers: { gameManager: GameManager };

  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.io = new IOServer(this.httpServer, { cors: { origin: '*' } });
    this.managers = { gameManager: new GameManager() };
  }

  public addExpressHandlers(connection: Connection) {
    // Add middlewares
    this.app.use(express.json());
    this.app.use(cors());

    this.app.use((req, _, next) => {
      console.log(req.url);
      next();
    });

    const sessionRepository = connection.getRepository(SessionEntity);
    this.app.use(
      session({
        secret: config.secret.session,
        saveUninitialized: false,
        resave: false,
        store: new TypeormStore({ repository: sessionRepository })
      })
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());
    initializePassport();

    // Add Routers
    this.app.get('/', (_, res) => {
      res.send('Tichu api server');
    });

    this.app.use(config.apiPrefix, mainRouter(this));
  }

  public addSocketHandlers(_: Connection) {
    console.log('!! Add socket handlers !!');
  }

  public listen() {
    this.httpServer.listen(config.httpPort, () => {
      console.log(`Server running at ${config.httpPort}`);
    });
  }

  public teardown() {
    this.io.disconnectSockets();
    this.io.close();
    this.httpServer.close();
  }

  public static async start() {
    const server = new Server();

    console.log('/////////// Server Configuration /////////');
    console.log(config);
    console.log('////////////////////////////////////////////');

    const connection = await createConnection(config.ormConfig);

    server.addExpressHandlers(connection);

    server.addSocketHandlers(connection);

    server.listen();
  }
}

export default Server;
