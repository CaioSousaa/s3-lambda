import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpCode,
  HttpStatus,
  Type,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiConsumes,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';
import { UploadResponseDto } from '../../dto/upload-response.dto';
import type { MemoryUploadedFile } from '../../../../utils/memory-uploaded-file';
import { UploadService } from '../../services/upload.service';

const uploadResponseSchemaType: Type<UploadResponseDto> = UploadResponseDto;

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) { }

  @Post()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Faz upload de um arquivo CSV e envia ao S3' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Upload realizado com sucesso',
    type: uploadResponseSchemaType,
  })
  @ApiResponse({ status: 400, description: 'Arquivo inválido ou ausente' })
  async upload(@UploadedFile() file: MemoryUploadedFile | undefined): Promise<UploadResponseDto> {
    return this.uploadService.processAndUpload(file);
  }
}
