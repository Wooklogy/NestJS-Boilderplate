import { ResponseAccountDto } from '@app/account/dto/response-account.dto';
import { Account } from '@app/account/entities/account.entity';
import { baseEntity } from '@common/base/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsUUID } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  ViewEntity,
} from 'typeorm';

// @ViewEntity({
//   expression: `
//       SELECT "post"."id" AS "id", "post"."name" AS "name", "category"."name" AS "categoryName"
//       FROM "file" "file"
//       LEFT JOIN "category" "category" ON "post"."categoryId" = "category"."id"
//   `
// })

@Entity('file')
export class File extends baseEntity {
  @IsUUID()
  @PrimaryColumn()
  uuid: string;

  @ManyToOne(() => Account, (uploader) => uploader.uuid, {
    createForeignKeyConstraints: Boolean(process.env.FK_ENABLE),
  })
  @JoinColumn({ name: 'uploader_id', referencedColumnName: 'uuid' })
  uploader: ResponseAccountDto;

  @IsString()
  @ApiProperty({ description: '업로더UUID', nullable: true, required: false })
  @Column()
  uploader_id!: string;

  @ApiProperty({ description: '파일 이름' })
  @IsString()
  @Column()
  origin_name: string;

  @IsString()
  @Column({ comment: '파일 타입' })
  mime_type: string;

  @IsString()
  @Column({ comment: '확장자' })
  extension: string;

  @IsNumber()
  @Column({ comment: '파일크기' })
  size: number;

  @IsString()
  @Column({ comment: '저장경로' })
  path: string;
}
