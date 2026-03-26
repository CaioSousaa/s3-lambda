import { ApiProperty } from '@nestjs/swagger';

export class UploadResponseDto {
  @ApiProperty({ example: 'Upload realizado com sucesso.' })
  message: string;

  @ApiProperty({ example: 'dados.csv' })
  fileName: string;

  @ApiProperty({ example: 'uploads/1711378800000-dados.csv' })
  s3Key: string;

  @ApiProperty({ example: 150 })
  rowCount: number;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  uploadedAt: string;
}
