import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

interface ClientConnected {
  [id: string]: Socket;
}

@Injectable()
export class MsgWebSocketService {
  private clientConnected: ClientConnected = {};

  handleConnection(socket: Socket) {
    this.clientConnected[socket.id] = socket;
  }

  handleDisconnect(id: string) {
    delete this.clientConnected[id];
  }

  getClientsConnected(): number {
    return Object.keys(this.clientConnected).length;
  }
}
