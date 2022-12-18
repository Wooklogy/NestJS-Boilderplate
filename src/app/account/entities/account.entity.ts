import { BeforeInsert, Column, Entity } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { InternalServerErrorException } from '@nestjs/common';
import { AllowAuthRole } from '@common/types/role.type';
import { baseEntityUUID } from '@common/base/base.entity';

@Entity('account')
export class Account extends baseEntityUUID {
  @IsString()
  @MinLength(1)
  @MaxLength(24)
  @ApiProperty({
    type: String,
    description: '유저 이름',
    nullable: false,
    example: 'Artlogy',
    minLength: 1,
    maxLength: 24,
  })
  @Column({ length: 24, comment: '유저 이름', nullable: false })
  name: string;

  @IsString()
  @IsEmail()
  @MaxLength(128)
  @ApiProperty({
    type: String,
    description: '이메일',
    uniqueItems: true,
    nullable: false,
    example: 'artlogy@example.com',
  })
  @Column({ length: 128, comment: '이메일', unique: true, nullable: false })
  email: string;

  @IsString()
  @ApiProperty({
    type: String,
    description: '패스워드',
    nullable: false,
  })
  @Column({
    length: 256,
    comment: '패스워드',
    nullable: false,
  })
  password: string;

  @IsEnum(AllowAuthRole)
  @ApiProperty({ enum: AllowAuthRole, name: 'role', description: '유저 룰' })
  @Column({
    type: 'enum',
    enum: AllowAuthRole,
    name: 'role',
    comment: '유저 룰',
  })
  role: string;

  @Column({
    length: 128,
    comment: '리플래시 토큰',
    nullable: true,
  })
  refresh_token: string;

  @BeforeInsert()
  private async pwdHashing(pwd: string): Promise<void> {
    try {
      this.password = await bcrypt.hash(this.password || pwd, 10);
    } catch (e) {
      throw new InternalServerErrorException('Password hashing error!!!');
    }
  }
}
