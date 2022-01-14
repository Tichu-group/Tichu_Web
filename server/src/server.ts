import http from 'http';
import express from 'express';
import { Server as IOServer } from 'socket.io';
import config from './config';
import GameManager from './managers/gameManager';

class Server {
  public httpServer: http.Server;
  public app: Express.Application;
  public io: IOServer;
  public managers: { gameManager: GameManager };

  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.io = new IOServer(this.httpServer, { cors: { origin: '*' } });
    this.managers = { gameManager: new GameManager() };
  }

  public async prepareDB() {}

  public addExpressHandlers() {}

  public addSocketHandlers() {}

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

    const connection = await server.prepareDB();

    server.addExpressHandlers();

    server.addSocketHandlers();

    server.listen();
  }
}

export default Server;
