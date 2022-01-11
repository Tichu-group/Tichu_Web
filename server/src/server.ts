import http from 'http';
import express from 'express';
import { Server as IOServer } from 'socket.io';
import config from './config';

class Server {
  private httpServer: http.Server;
  private app: Express.Application;
  private io: IOServer;

  constructor() {
    this.app = express();
    this.httpServer = http.createServer(this.app);
    this.io = new IOServer(this.httpServer, { cors: { origin: '*' } });
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

  public static start() {
    const server = new Server();
    server.listen();
  }
}

export default Server;
