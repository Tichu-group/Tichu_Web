import http from 'http';
import express, { Express } from 'express';
import { Server as IOServer } from 'socket.io';
import config from './config';
import GameManager from './managers/gameManager';
import mainRouter from './routes';
import { Connection, createConnection } from 'typeorm';

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
    this.app.use(config.apiPrefix, mainRouter);
  }

  public addSocketHandlers(connection: Connection) {}

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

    const connection = await createConnection(config.ormConfig);

    server.addExpressHandlers(connection);

    server.addSocketHandlers(connection);

    server.listen();
  }
}

export default Server;
