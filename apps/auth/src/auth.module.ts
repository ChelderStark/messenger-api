import { ConfigModule } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule, PostgresDBModule } from '@app/shared';

import { UserEntity } from './user.entity';
import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    }),
    
    SharedModule,
    PostgresDBModule,

    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
