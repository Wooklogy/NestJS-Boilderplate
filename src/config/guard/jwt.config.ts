import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  JwtModuleAsyncOptions,
  JwtSignOptions,
  JwtVerifyOptions,
} from '@nestjs/jwt';

export const jwtModuleOptions: JwtModuleAsyncOptions = {
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    secret: configService.get('JWT_SECRET'),
    signOptions: { expiresIn: configService.get('JWT_ACCESS_EXPIREIN') },
  }),
  inject: [ConfigService],
};

export class JwtOptions {
  //엑세스 토큰 발급 옵션
  JwtSignAccessOptions(): JwtSignOptions {
    return {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_ACCESS_EXPIREIN,
    };
  }
  //엑세스 토큰 복호화 옵션
  JwtVerifyAccessOptions(): JwtVerifyOptions {
    return {
      secret: process.env.JWT_SECRET,
    };
  }
  //리플래시 토큰 발급 옵션
  JwtSignRefreshOptions(): JwtSignOptions {
    return {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_REFRESH_EXPIREIN,
    };
  }
  //리플래시 토큰 복호화 옵션
  JwtVerifyRefreshOptions(): JwtVerifyOptions {
    return {
      secret: process.env.JWT_REFRESH_SECRET,
    };
  }
}

export const AccessToken: string = 'access_token';
export const RefreshToken: string = 'refresh_token';

export type JwtPayload = {
  [key: string]: any;
  email: string;
  role: string;
  iat: number;
  exp: number;
};
