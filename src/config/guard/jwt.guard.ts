import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { JwtOptions, JwtPayload } from './jwt.config';
import { Request } from 'express';
import { MyLogger } from '@config/logger.config';
import { AllowAuthRole } from '@common/types/role.type';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly refector: Reflector,
    private readonly logger: MyLogger,
    private readonly jwtService: JwtService,
    private readonly jwtOptions: JwtOptions,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic: boolean = this.refector.get<boolean>(
      'isPublic',
      context.getHandler(),
    );
    const roles: AllowAuthRole[] = this.refector.get<AllowAuthRole[]>(
      'roles',
      context.getHandler(),
    );
    const request: Request = context.switchToHttp().getRequest<Request>();

    if (isPublic) return true;

    return this.validateRequest(request, roles);
  }

  private validateRequest(
    request: Request,
    roles: AllowAuthRole[],
  ): Promise<boolean> | boolean {
    const token: any = request.headers.access_token;

    try {
      const info: JwtPayload = this.jwtService.verify(
        token,
        this.jwtOptions.JwtVerifyAccessOptions(),
      );

      const result: number = roles.filter((el) => el === info.role).length;
      this.logger.error('록록ㅇㄴ머엄냥', AuthGuard.name);
      return Boolean(result);
    } catch {
      throw new ForbiddenException('권한이 없습니다.');
    }
  }
}
