import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { baseEntity } from './base.entity';

export class RequestBaseFlitering extends PartialType(
  OmitType(baseEntity, ['created_at', 'deleted_at', 'updated_at'] as const),
) {
  @ApiProperty({ description: '생성일 시작', required: false })
  @IsOptional()
  create_start?: Date;
  @ApiProperty({ description: '생성일 종료', required: false })
  @IsOptional()
  create_end?: Date;

  @ApiProperty({ description: '수정일 시작', required: false })
  @IsOptional()
  updated_start?: Date;
  @ApiProperty({ description: '수정일 종료', required: false })
  @IsOptional()
  updated_end?: Date;

  @ApiProperty({ description: '삭제일 시작', required: false })
  @IsOptional()
  delete_start?: Date;
  @ApiProperty({ description: '삭제일 종료', required: false })
  @IsOptional()
  delete_end?: Date;
}
