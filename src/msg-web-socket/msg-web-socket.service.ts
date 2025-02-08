import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Socket } from 'socket.io';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';

interface ClientConnected {
  [id: string]: { socket: Socket; user: User };
}

@Injectable()
export class MsgWebSocketService {
  private clientConnected: ClientConnected = {};

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async handleConnection(socket: Socket, userId: string) {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) throw new Error(`User ${userId} not found`);
    if (!user.isActice) throw new Error(`User ${userId} is inactive`);

    this.clientConnected[socket.id] = { socket, user };
  }

  handleDisconnect(id: string) {
    delete this.clientConnected[id];
  }

  getClientsConnected(): string[] {
    return Object.keys(this.clientConnected);
  }

  getFullName(socketId: string) {
    return this.clientConnected[socketId]?.user?.fullName;
  }

  verifyRepeatUser(userId: string) {
    for (const socketId of Object.keys(this.clientConnected)) {
      const client = this.clientConnected[socketId];
      if (client.user.id === userId) {
        client.socket.disconnect();
        break;
      }
    }
  }
}
