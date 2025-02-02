import { WebSocketGateway } from '@nestjs/websockets';
import { MsgWebSocketService } from './msg-web-socket.service';

@WebSocketGateway()
export class MsgWebSocketGateway {
  constructor(private readonly msgWebSocketService: MsgWebSocketService) {}
}
