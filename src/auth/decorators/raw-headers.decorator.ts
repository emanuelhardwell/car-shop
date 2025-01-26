import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const RawHeadersDecorator = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const headers = req.headers;

    if (!headers) {
      throw new InternalServerErrorException(
        'headers not found in the Request!',
      );
    }

    return !data ? headers : headers[data];
  },
);
