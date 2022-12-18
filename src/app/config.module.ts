import { BaseQuery } from '@common/base/base.query';
import { dataBaseConfig } from '@config/database.config';
import { LOCAL_ATTACH_SAVE_PATH } from '@config/file.config';
import { HttpExceptionFilter } from '@config/filters/exception.filter';
import { JwtOptions } from '@config/guard/jwt.config';
import { AuthGuard } from '@config/guard/jwt.guard';
import { LoggingInterceptor } from '@config/interceptors/logging.interceptor';
import { MyLogger } from '@config/logger.config';
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'path';
import { HealthCheckController } from './health-check/health-check.controller';

@Global()
@Module({
  imports: [
    // env
    ConfigModule.forRoot({
      envFilePath:
        process.env.NODE_ENV === 'prod'
          ? ['src/config/env/.prod.env']
          : ['src/config/env/.dev.env'],
    }),
    // static resource
    ServeStaticModule.forRoot({
      rootPath: path.join(LOCAL_ATTACH_SAVE_PATH, '../'),
    }),
    // database
    TypeOrmModule.forRootAsync(dataBaseConfig),
    ScheduleModule.forRoot(),
    TerminusModule,
    HttpModule,
  ],
  providers: [
    JwtOptions,
    JwtService,
    MyLogger,
    BaseQuery,
    AuthGuard,
    { provide: 'EXCEPTION_FILTER', useClass: HttpExceptionFilter },
    LoggingInterceptor,
  ],
  controllers: [HealthCheckController],
  exports: [JwtOptions, JwtService, MyLogger, BaseQuery],
})
export class CustomConfigModule {}
