import { Module } from '@nestjs/common';
import { UploadController } from './infra/controller/upload.controller';
import { UploadService } from './services/upload.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService]
})
export class UploadModule { }
