import { ApiProperty, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { File } from '../entities/file.entity';

export class RequestFileDto extends PickType(File, ['uploader_id'] as const) {
  @ApiProperty({ type: 'string', format: 'binary', description: '파일' })
  file: Express.Multer.File;
}

export class CreateFileDto extends PickType(File, [
  'uploader_id',
  // 'uploader',
  'mime_type',
  'size',
  'uuid',
  'origin_name',
  'path',
  'extension',
] as const) {}

export class FilteringFileDto extends PartialType(
  OmitType(File, [
    'created_at',
    'deleted_at',
    'uploader',
    'updated_at',
  ] as const),
) {
  @ApiProperty({ description: '생성일 시작', required: false })
  @IsOptional()
  create_start?: Date;
  @ApiProperty({ description: '생성일 종료', required: false })
  @IsOptional()
  create_end?: Date;

  @ApiProperty({ description: '삭제일 시작', required: false })
  @IsOptional()
  delete_start?: Date;
  @ApiProperty({ description: '삭제일 종료', required: false })
  @IsOptional()
  delete_end?: Date;
}
