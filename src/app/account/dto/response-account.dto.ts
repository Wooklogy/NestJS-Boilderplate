import { OmitType, PartialType } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { Account } from '../entities/account.entity';

export class ResponseAccountDto extends PartialType(Account) {
  @Exclude()
  refresh_token?: string;
  @Exclude()
  password?: string;
}
