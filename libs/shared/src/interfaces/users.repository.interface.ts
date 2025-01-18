import { BaseInterfaceRepository } from "../repositories/base/base.interface.repository";
import { UserEntity } from "apps/auth/src/user.entity";

export interface UserRepositoryInterface extends BaseInterfaceRepository<UserEntity>{}