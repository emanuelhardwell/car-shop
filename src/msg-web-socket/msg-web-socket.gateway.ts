import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { MsgWebSocketService } from './msg-web-socket.service';
import { Server, Socket } from 'socket.io';
import { messageDto } from './dto/message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from 'src/auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MsgWebSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly msgWebSocketService: MsgWebSocketService,
    private readonly jwtservice: JwtService,
  ) {}

  @WebSocketServer() wss: Server;

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers?.authentication as string;
    let payload: JwtPayload;

    try {
      payload = this.jwtservice.verify(token);
      //console.log(payload);
      this.msgWebSocketService.verifyRepeatUser(payload.id);
      await this.msgWebSocketService.handleConnection(client, payload.id);
    } catch (error) {
      //throw new WsException('Invalid credentials!');
      console.log('ERROR: ', error.message);
      client.disconnect();
      return;
    }

    //console.log(`Client connected : ${client.id} `);
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

  @SubscribeMessage('message_client')
  messageClient(client: Socket, payload: messageDto) {
    console.log(`Received message from ${client.id}: ${payload.message}`);

    //! Private communication, directed to the issuer(emisor).
    // client.emit('message_server', { id: data.id, message: data.message });

    //! Public communication, directed to everyone else, excluding the issuer
    // client.broadcast.emit('message_server', {
    //   id: data.id,
    //   message: data.message,
    // });

    //! Send the message to all
    this.wss.emit('message_server', {
      fullname: this.msgWebSocketService.getFullName(client.id),
      message: payload.message,
    });
  }
}
