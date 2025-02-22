import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

import { Repository } from 'typeorm';

import { UserEntity } from './user.entity';
import { NewUserDto } from './dto/new-user.dto';
import { ExistingUserDto } from './dto/existing-user.dto';
import { JwtService } from '@nestjs/jwt';
import { UserRepositoryInterface } from '@app/shared/interfaces/users.repository.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepositoryInterface') private readonly userRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService,
  ){}

  async getUsers(){
    return this.userRepository.findAll();
  }

  async postUser(){
    return this.userRepository.save({firstName: 'Larry'})
  }

  async findByEmail(email: string): Promise<UserEntity> {
    return this.userRepository.findByCondition({
      where: {email},
      select: ['id', 'firstName', 'lastName', 'email', 'password'],
    })
  }
  
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async register(newUser: Readonly<NewUserDto>): Promise<UserEntity>{
    const { firstName, lastName, email, password } = newUser;

    const existingUser = await this.findByEmail(email);
    if(existingUser){
      throw new ConflictException('An account with that email already exists!')
    }

    const hashedPassword = await this.hashPassword(password);
    const savedUser = await this.userRepository.save({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    })

    delete savedUser.password
    return savedUser;
  }

  async doesPasswordMatch(password: string, hashedPassword: string): Promise<Boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  async validateUser(email:string, password: string): Promise<UserEntity> {
    const user = await this.findByEmail(email);   
    
    const doesUserExists = !!user
    if(!doesUserExists) return null
    
    const doesPasswordMatch = await this.doesPasswordMatch(password, user.password)
    
    if(!doesPasswordMatch) return null
    
    return user;
  }

  async login(existingUser: Readonly<ExistingUserDto>) {
    const {email, password} = existingUser;
    const user = await this.validateUser(email, password);

    console.log(user);
    

    if(!user) {
      throw new UnauthorizedException()
    }

    const jwt = await this.jwtService.signAsync({ user });
    console.log(jwt);
    

    return {token: jwt}
  }

  async verifyJwt(jwt: string): Promise<{exp: number}> {
    if(!jwt){
      throw new UnauthorizedException()
    }

    try{
      const {exp} = await this.jwtService.verifyAsync(jwt)
      return {exp}
    }catch (error){
      throw new UnauthorizedException()
    }
  }
}
