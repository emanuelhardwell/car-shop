import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/file-filter.helper';
import { HandleError } from '../common/exceptions/handle-error';
import { diskStorage } from 'multer';
import { fileRename } from './helpers/file-rename.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly handleError: HandleError,
    private readonly configService: ConfigService,
  ) {}

  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      // limits: { fileSize: 1000 }
      storage: diskStorage({
        destination: './static/products',
        filename: fileRename,
      }),
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      if (!file) {
        throw new BadRequestException('No file provided');
      }

      const secureUrl = `${this.configService.get("HOST_API")}/v1/files/product/${file.filename}`;
      return { secureUrl };
    } catch (error) {
      this.handleError.handleErrorService(error);
    }
  }

  @Get('product/:id')
  findFile(@Res() res: Response, @Param('id') id: string) {
    const path = this.filesService.findFile(id);
    res.sendFile(path);
  }
}
