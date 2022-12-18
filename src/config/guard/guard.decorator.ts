import { AllowAuthRole } from '@common/types/role.type';
import { AccessToken, RefreshToken } from '@config/guard/jwt.config';
import { AuthGuard } from '@config/guard/jwt.guard';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiOperationOptions,
} from '@nestjs/swagger';

// 가드 X
const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

// Role별 권한 구분
export const Roles = (...roles: AllowAuthRole[] | string[]) =>
  SetMetadata('roles', roles);

// 권한이 필요한 앤드포인트일 경우 사용하세요
export const ApiGuard = (
  option?: ApiOperationOptions,
  roles?: AllowAuthRole[] | string[],
) => {
  if (!roles)
    return applyDecorators(
      ApiOperation(option),
      UseGuards(AuthGuard),
      Public(),
      ApiBearerAuth(AccessToken),
      ApiBearerAuth(RefreshToken),
    );
  return applyDecorators(
    ApiOperation({ ...option, description: 'Auth Role : ' + roles.toString() }),
    UseGuards(AuthGuard),
    Roles(...roles),
    ApiBearerAuth(AccessToken),
    ApiBearerAuth(RefreshToken),
  );
};
