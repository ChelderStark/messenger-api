import { NestFactory } from '@nestjs/core';
import { SharedService } from '@app/shared';
import { AuthModule } from './auth.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  
  const configService = app.get(ConfigService)
  const sharedService = app.get(SharedService);

  const queue = configService.get('RABBITMQ_AUTH_QUEUE');

  app.connectMicroservice(sharedService.getRmqOptions(queue))
  app.startAllMicroservices()
}
bootstrap();
