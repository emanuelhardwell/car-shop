import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetUserDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    // la DATA es lo que le pase por parametro a mi DECORADOR UTILIZADO, puede ser STRING o ARRAY
    // en el CONTEXTO viene toda la info del REQUEST
    // console.log(ctx);
    const req = ctx.switchToHttp().getRequest();
    const user = req.user;

    if (!user) {
      throw new InternalServerErrorException(
        'User not found in the Request - Contact to Admin!',
      );
    }

    return !data ? user : user[data];
  },
);
