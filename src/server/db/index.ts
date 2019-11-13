import "reflect-metadata";
import { createConnection } from "typeorm";

import { log } from "../log";
import {
    User,
    Match,
    //Party
} from "../model";

const DB_LOGGING = true;

export function connectDb() {
    try {
        return createConnection({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "tom",
            password: "tom",
            database: "elovate",
            entities: [
                User,
                //Comment,
                //Match,
                //Party
            ],
            synchronize: true,
            logging: DB_LOGGING
        });
    } catch (err) {
        log.error(err);
    }
}
