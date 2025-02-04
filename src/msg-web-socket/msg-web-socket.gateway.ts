import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MsgWebSocketService } from './msg-web-socket.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MsgWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly msgWebSocketService: MsgWebSocketService) {}

  @WebSocketServer() wss: Server;

  handleConnection(client: Socket, ...args: any[]) {
    //console.log(`Client connected : ${client.id} `);
    this.msgWebSocketService.handleConnection(client);
    // console.log(
    //   'conectados: ' + this.msgWebSocketService.getClientsConnected(),
    // );
    //console.log('args: ' + args);
    this.wss.emit(
      'clients_connected',
      this.msgWebSocketService.getClientsConnected(),
    );
  }
  handleDisconnect(client: Socket) {
    //console.log(`Client disconnected : ${client.id} `);
    this.msgWebSocketService.handleDisconnect(client.id);
    // console.log(
    //   'conectados: ' + this.msgWebSocketService.getClientsConnected(),
    // );
    this.wss.emit(
      'clients_connected',
      this.msgWebSocketService.getClientsConnected(),
    );
  }
}
