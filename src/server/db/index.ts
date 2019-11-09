import "reflect-metadata";
import { createConnection } from "typeorm";
import { User } from "../model";

const DB_LOGGING = false;

export function connectDb() {
    return createConnection({
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "tom",
        password: "tom",
        database: "elovate",
        entities: [
            User
        ],
        synchronize: true,
        logging: DB_LOGGING
    });
}
