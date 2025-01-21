import { BadRequestException, Injectable } from '@nestjs/common';
import { HandleError } from '../common/exceptions/handle-error';
import { join } from 'path';
import { existsSync } from 'fs';

@Injectable()
export class FilesService {
  constructor(private readonly handleError: HandleError) {}

  uploadFile() {
    try {
      return 'File uploaded successfully';
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }

  findFile(id: string) {
    try {
      const path = join(__dirname, '../../static/products/', id);

      if (!existsSync(path)) {
        throw new BadRequestException(`File not found with id ${id}!`);
      }

      return path;
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }
}
