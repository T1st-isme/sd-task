import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { LogActivityService } from 'src/services/log-activity.service';

@Module({
  controllers: [UserController],
  providers: [UserService, LogActivityService],
})
export class UserModule {}
