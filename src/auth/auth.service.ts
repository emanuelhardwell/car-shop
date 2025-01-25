import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { HandleError } from '../common/exceptions/handle-error';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly handleError: HandleError,
    private readonly jwtService: JwtService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
        token: this.getJwtToken({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        }),
      };
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }

  private getJwtToken(payload: JwtPayload): string {
    try {
      return this.jwtService.sign(payload);
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    try {
      const user = await this.userRepository.findOne({
        where: { email },
        select: {
          id: true,
          email: true,
          password: true,
          isActice: true,
          fullName: true,
        },
      });
      console.log(user);

      if (!user) throw new UnauthorizedException('Credentials not valid');
      if (!user.isActice) throw new UnauthorizedException('User is inactive');
      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('User or Password not valid');

      delete user.password;
      return {
        ...user,
        token: this.getJwtToken({
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        }),
      };
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }
}
