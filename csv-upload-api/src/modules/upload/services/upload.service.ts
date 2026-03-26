import { BadRequestException, Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { parse } from 'csv-parse/sync';
import { MemoryUploadedFile } from '../../../utils/memory-uploaded-file';
import { UploadResponseDto } from '../dto/upload-response.dto';

@Injectable()
export class UploadService {
  private readonly s3 = new S3Client(
    (() => {
      const region = process.env.AWS_REGION;
      const accessKeyId = process.env.AWS_ACCESS_KEY_ID_S3;
      const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY_S3;
      if (accessKeyId && secretAccessKey) {
        return {
          region,
          credentials: { accessKeyId, secretAccessKey },
        };
      }
      return { region };
    })(),
  );

  async processAndUpload(
    file: MemoryUploadedFile | undefined,
  ): Promise<UploadResponseDto> {
    if (!file) throw new BadRequestException('Nenhum arquivo enviado.');
    if (!file.originalname.endsWith('.csv')) {
      throw new BadRequestException('Somente arquivos .csv são aceitos.');
    }

    const records = parse(file.buffer, { columns: true, skip_empty_lines: true });

    const key = `uploads/${Date.now()}-${file.originalname}`;
    await this.s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: 'text/csv',
      }),
    );

    return {
      message: 'Upload realizado com sucesso.',
      fileName: file.originalname,
      s3Key: key,
      rowCount: records.length,
      uploadedAt: new Date().toISOString(),
    };
  }
}
