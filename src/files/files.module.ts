import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { CommonModule } from 'src/common/common.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [CommonModule, ConfigModule],
  controllers: [FilesController],
  providers: [FilesService],
})
export class FilesModule {}
