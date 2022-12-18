import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export class baseEntity {
  @ApiProperty({ description: '생성일' })
  @CreateDateColumn({ comment: '생성일' })
  created_at: Date;

  @ApiProperty({ description: '마지막 수정일' })
  @UpdateDateColumn({ comment: '마지막 수정일' })
  updated_at: Date;

  @ApiProperty({ description: '삭제일', nullable: true })
  @DeleteDateColumn({ comment: '삭제일' })
  deleted_at: Date;

  @ApiProperty({
    description: '삭제여부',
    default: false,
    nullable: false,
  })
  @Column({
    default: false,
    comment: '삭제여부',
    nullable: false,
  })
  is_deleted: boolean;

  @ApiProperty({
    description: '사용여부',
    default: true,
    nullable: false,
  })
  @Column({
    default: true,
    comment: '사용여부',
    nullable: false,
    collation: 'ASC',
  })
  is_usable: boolean;
}

export abstract class baseEntityUUID extends baseEntity {
  @ApiProperty({
    description: 'uuid',
    nullable: false,
  })
  @PrimaryGeneratedColumn('uuid')
  uuid: string;
}

export abstract class baseEntityID extends baseEntity {
  @ApiProperty({
    description: 'id',
    nullable: false,
  })
  @PrimaryGeneratedColumn()
  id: number;
}

// export class BaseQuery extends baseEntity {
//   constructor(@Inject(DataSource) private readonly dataSource: DataSource) {
//     super();
//   }

//   // async get(entity: any, dto:any) {
//   //   this.dataSource.createQueryBuilder(entity)
//   //   .where()
//   //   .
//   // }
// }
