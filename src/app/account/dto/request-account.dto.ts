import { RequestBaseFlitering } from '@common/base/base.dto';
import {
  IntersectionType,
  OmitType,
  PartialType,
  PickType,
} from '@nestjs/swagger';
import { Account } from '../entities/account.entity';

export class CreateAccountDto extends PickType(Account, [
  'email',
  'name',
  'password',
  'role',
] as const) {}
export class UpdateAccountDto extends PartialType(CreateAccountDto) {}

// 검색 Dto
export class FilteringAccountDto extends PartialType(
  IntersectionType(
    RequestBaseFlitering,
    OmitType(Account, [
      'password',
      'refresh_token',
      'updated_at',
      'deleted_at',
      'created_at',
    ] as const),
  ),
) {}

// 로그인 Dto
export class LoginAccountDto extends PickType(Account, ['email', 'password']) {}
