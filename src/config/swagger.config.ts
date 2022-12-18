import { DocumentBuilder } from '@nestjs/swagger';
import { AccessToken, RefreshToken } from './guard/jwt.config';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Test Open API')
  .setDescription('테스트용 오픈API입니다.')
  .setVersion('1.0')
  .addApiKey(
    {
      description: 'JWT access_token',
      type: 'apiKey',
      bearerFormat: 'JWT',
    },
    AccessToken,
  )
  .addApiKey(
    {
      description: 'JWT refresh_token',
      type: 'apiKey',
      bearerFormat: 'JWT',
    },
    RefreshToken,
  )
  .build();
