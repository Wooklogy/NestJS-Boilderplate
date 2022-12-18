import { CorsConfig } from '@config/cors.config';
import { AuthGuard } from '@config/guard/jwt.guard';
import { LoggingInterceptor } from '@config/interceptors/logging.interceptor';
import { MyLogger } from '@config/logger.config';
import { swaggerConfig } from '@config/swagger.config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    logger:
      process.env.NODE_ENV === 'prod'
        ? ['error', 'warn', 'log']
        : ['debug', 'error', 'log', 'verbose', 'warn'],
  });
  app.enableCors(CorsConfig);
  app.useGlobalPipes(
    new ValidationPipe({
      // 변환 허용
      transform: true,
      // 유효성 검사 데코레이터가 없는 필드를 요청 할 경우 건너뜀
      whitelist: true,
      // 유효성 검사 데코레이터가 없는 필드가 있을 경우 에러를 반환
      forbidNonWhitelisted: true,
      // null, undefined값을 가진 객체는 유효성 검사를 건너뜀
      skipMissingProperties: true,
    }),
  );
  // app.useGlobalGuards(app.get<AuthGuard>(AuthGuard));
  app.useLogger(app.get<MyLogger>(MyLogger));
  // app.useGlobalInterceptors(app.get(LoggingInterceptor));
  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, swaggerDocument);
  await app.listen(8084, () => {
    console.log('server running');
  });
}
bootstrap();
