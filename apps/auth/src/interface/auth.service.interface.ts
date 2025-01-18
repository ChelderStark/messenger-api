import { ExistingUserDto } from "../dto/existing-user.dto";
import { NewUserDto } from "../dto/new-user.dto";
import { UserEntity } from "../user.entity";

export interface AuthServiceInterface {
    getUsers(): Promise<UserEntity[]>;
    findByEmail(email: string): Promise<UserEntity>;
    hashPassword(password: string): Promise<string>;
    register(newUser: Readonly<NewUserDto>): Promise<UserEntity>;
    doesPasswordMatch(password: string, hashedPassword: string): Promise<Boolean>;
    validateUser(email:string, password: string): Promise<UserEntity>;
    login(existingUser: Readonly<ExistingUserDto>);
    verifyJwt(jwt: string): Promise<{exp: number}>;
}