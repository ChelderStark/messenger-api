import { Controller, Inject, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { SharedService } from '@app/shared';
import { NewUserDto } from './dto/new-user.dto';
import { ExistingUserDto } from './dto/existing-user.dto';
import { JwtStrategy } from './jwt.strategy';

@Controller()
export class AuthController {
  constructor(
      @Inject('AuthServiceInterface') private readonly authService: AuthService,
      @Inject('SharedServiceInterface') private readonly sharedService: SharedService,
  ) {}

  @MessagePattern({cmd: 'get-users'})
  async getUser(@Ctx() context: RmqContext){
      this.sharedService.acknowledgeMessage(context)

      return this.authService.getUsers()
  }

  @MessagePattern({ cmd: 'register' })
  async register(
    @Ctx() context: RmqContext,
    @Payload() newUser: NewUserDto,
  ){
    this.sharedService.acknowledgeMessage(context)

    return this.authService.register(newUser)
  }

  @MessagePattern({ cmd: 'login' })
  async login(
    @Ctx() context: RmqContext,
    @Payload() existingUser: ExistingUserDto,
  ){
    this.sharedService.acknowledgeMessage(context)

    return this.authService.login(existingUser)
  }

  @MessagePattern({ cmd: 'verify-jwt' })
  @UseGuards(JwtStrategy)
  async verifyJwt(
    @Ctx() context: RmqContext,
    @Payload() payload: {jwt: string},
  ){
    this.sharedService.acknowledgeMessage(context)

    return this.authService.verifyJwt(payload.jwt)
  }
}
