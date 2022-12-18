import { OmitType, PartialType } from '@nestjs/swagger';
import { File } from '../entities/file.entity';

export class ResponseFileDto extends PartialType(
  OmitType(File, ['uploader'] as const),
) {}
