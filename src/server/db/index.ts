import "reflect-metadata";
import { createConnection } from "typeorm";

import { log } from "../log";

import * as Model from "../model";

type DbLogType = "query" | "error" | "schema" | "warn" | "info" | "log";

export function connectDb() {
    try {
        const loggingOpt: DbLogType[] = process.env.DB_LOGGING.split(" ").map(s => s as DbLogType);
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
            logging: loggingOpt
        });
        return conn;
    } catch (err) {
        log.error(err);
        throw err;
    }
}
