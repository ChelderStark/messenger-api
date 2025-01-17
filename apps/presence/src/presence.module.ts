import { Module } from '@nestjs/common';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import { AuthGuard, SharedModule } from '@app/shared';
import { ConfigModule } from '@nestjs/config';
import { PostgresDBModule } from '@app/shared/postgresdb.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    }),
    SharedModule,
    // SharedModule.registerRmq('AUTH_SERVICE', process.env.RABBITMQ_AUTH_QUEUE),
  ],
  controllers: [PresenceController],
  providers: [PresenceService],
})
export class PresenceModule {}
