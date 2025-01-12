import { DataSource, DataSourceOptions } from "typeorm";
import { UserEntity } from "../user.entity";
import * as dotenv from 'dotenv'

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [UserEntity],
    migrations: ['dist/apps/auth/db/migrations/*.js']
}

export const dataSource = new DataSource(dataSourceOptions)