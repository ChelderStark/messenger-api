import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(
    @Inject('AUTH_SERVICE') private authService: ClientProxy,
    @Inject('PRESENCE_SERVICE') private presenceService: ClientProxy,
  ) {}

  @Get('auth')
  async getUser(){
    return this.authService.send({cmd: 'get-users'}, {})
  }

  @Post('auth')
  async postUser(){
    return this.authService.send({cmd: 'post-user'}, {})
  }

  @Get('presence')
  async getPresence(){
    return this.presenceService.send({cmd: 'get-presence'}, {})
  }

  @Post('auth/register')
  async register(
    @Body('firstName') firstName: string,
    @Body('lastName') lastName: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ){
    return this.authService.send({cmd: 'register'}, {
      firstName, lastName, email, password
    })
  }
}
