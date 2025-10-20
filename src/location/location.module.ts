import { Module } from '@nestjs/common';
import { LocationGateway } from './location.gateway';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [LocationGateway],
})
export class LocationModule {}
