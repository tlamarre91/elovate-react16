import "reflect-metadata";
import { createConnection } from "typeorm";

import { log } from "../log";

import * as Model from "../model";

const DB_LOGGING = true;

export function connectDb() {
    try {
        const conn = createConnection({
            type: "postgres",
            host: "localhost",
            port: 5432,
            username: "tom",
            password: "tom",
            database: "elovate",
            entities: [ // TODO: feels gross to include these explicitly. get "could not connect" if i forget to add.
                        // should probably just do file reference to dist/server/model/* like every doc suggests
                Model.User,
                Model.Match,
                Model.MatchParty,
                Model.Game,
                Model.Group,
                Model.ImageAsset,
                Model.Session
            ],
            synchronize: true,
            logging: DB_LOGGING
        });
        log.info("connected");
        log.info(JSON.stringify(conn));
        return conn;
    } catch (err) {
        log.error(err);
        throw err;
    }
}
