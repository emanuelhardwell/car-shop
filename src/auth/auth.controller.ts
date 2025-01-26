import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUserDecorator } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';
import { RawHeadersDecorator } from './decorators/raw-headers.decorator';
import { UserRoleGuard } from './guards/user-role/user-role.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }
  @Post('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  privateDefault(
    // @Req() request: Express.Request, ## NO se debe sacar la INFO directamente del REQUEST, (se debe crear un Decorador)
    @GetUserDecorator() user: User,
    @GetUserDecorator('email') email: string,
    @RawHeadersDecorator() rawHeaders: object,
    @RawHeadersDecorator('authorization') header: string,
  ) {
    const res = this.authService.privateDefault();
    return { ...res, user, email, rawHeaders, header };
  }

  @Get('private2')
  @SetMetadata('roles', ['admin', 'super-admin']) //SetMetadata: ya NO se recomienda usar porque no podemos equivocar facilmente en el MetadataKey
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateWithCustomGuard(@GetUserDecorator() user: User) {
    const res = this.authService.privateDefault();
    return { ...res, user };
  }
}
