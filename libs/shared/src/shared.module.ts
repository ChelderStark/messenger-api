import { DynamicModule, Module } from '@nestjs/common';
import { SharedService } from './shared.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: './.env'
    })
  ],
  providers: [SharedService],
  exports: [SharedService],
})
export class SharedModule {
  static registerRmq(service: string, queue: string): DynamicModule {

    const providers = [
      {
        provide: service,
        useFactory: (configService: ConfigService) => {
          const USER = configService.get('RABBITMQ_DEFAULT_USER')
          const PASSWORD = configService.get('RABBITMQ_DEFAULT_PASS')
          const HOST = configService.get('RABBITMQ_HOST')

          return ClientProxyFactory.create({
            transport: Transport.RMQ,
            options: {
              urls:[`amqp://${USER}:${PASSWORD}@${HOST}`],
              queue: queue,
              queueOptions: {
                durable: true,
              },
            },
          });
        },
        inject: [ConfigService]
      },
    ]

    return {
      module: SharedModule,
      providers,
      exports: providers,
    }
  }
}
