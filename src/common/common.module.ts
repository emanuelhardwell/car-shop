import { Module } from '@nestjs/common';
import { HandleError } from './exceptions/handle-error';

@Module({
  providers: [HandleError],
  exports: [HandleError],
})
export class CommonModule {}
