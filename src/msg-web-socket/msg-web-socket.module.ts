import { Module } from '@nestjs/common';
import { MsgWebSocketService } from './msg-web-socket.service';
import { MsgWebSocketGateway } from './msg-web-socket.gateway';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [MsgWebSocketGateway, MsgWebSocketService],
})
export class MsgWebSocketModule {}
