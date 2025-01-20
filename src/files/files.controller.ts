import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/file-filter.helper';
import { HandleError } from '../common/exceptions/handle-error';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly handleError: HandleError,
  ) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      return this.filesService.uploadFile();
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }
}
