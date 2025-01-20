import { Injectable } from '@nestjs/common';
import { HandleError } from '../common/exceptions/handle-error';

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
}
