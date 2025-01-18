import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SharedModule, PostgresDBModule, SharedService } from '@app/shared';

import { UserEntity } from './user.entity';
import { AuthController } from './auth.controller';

import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtGuard } from './jwt.guard';
import { JwtStrategy } from './jwt.strategy';
import { UsersRepository } from '@app/shared/repositories/users.repository';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './.env'
    }),

    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: '3600s' }
      }),
      inject: [ConfigService],
    }),
    
    SharedModule,
    PostgresDBModule,

    TypeOrmModule.forFeature([UserEntity])
  ],
  controllers: [AuthController],
  providers: [
    {
      provide:'AuthServiceInterface',
      useClass: AuthService,
    },
    {
      provide: 'UserRepositoryInterface',
      useClass: UsersRepository,
    },
    {
      provide: 'SharedServiceInterface',
      useClass: SharedService,
    }, 
    JwtGuard, 
    JwtStrategy],
})
export class AuthModule {}
