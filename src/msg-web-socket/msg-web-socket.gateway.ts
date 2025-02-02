import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MsgWebSocketService } from './msg-web-socket.service';
import { Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MsgWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly msgWebSocketService: MsgWebSocketService) {}
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected : ${client.id} `);
    console.log(args);
  }
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected : ${client.id} `);
  }
}
