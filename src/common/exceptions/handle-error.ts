import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class HandleError {
  handleErrorService(error: unknown) {
    console.error(error);

    if (error instanceof QueryFailedError) {
      const message = `PostgreSQL Error: ${error.message}`;
      throw new BadRequestException(message);
    }

    if (error instanceof Error && error.name === 'EntityNotFound') {
      throw new BadRequestException('Entity not found');
    }

    if (typeof error === 'string') {
      throw new BadRequestException(error);
    }

    if (error instanceof Error) {
      throw new InternalServerErrorException(error.message);
    }

    throw new InternalServerErrorException('An unexpected error occurred');
  }
}
