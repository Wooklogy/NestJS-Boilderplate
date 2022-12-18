import { Module } from '@nestjs/common';
import { AccountModule } from './account/account.module';
import { FileModule } from './file/file.module';
import { CustomConfigModule } from './config.module';

@Module({
  imports: [CustomConfigModule, AccountModule, FileModule],
})
export class AppModule {}
