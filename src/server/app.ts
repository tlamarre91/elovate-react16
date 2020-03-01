import "module-alias/register"; // required to allow module path aliases (i.e. "~shared" -> "dist/shared")
import appRoot from "app-root-path";
import bodyParser from "body-parser";
import express from "express";
import createError from "http-errors";
import morgan from "morgan";
import path from "path";
import session from "express-session";
import * as Orm from "typeorm";
import dotenv from "dotenv";
dotenv.config();

import * as Util from "~server/util";
import { log } from "~server/log";
import * as Api from "~shared/api";

import { connectDb } from "~server/db";
import routes from "~server/routes";
import { SessionStore, Session, SessionRepository } from "~shared/model/Session";
import * as Model from "~shared/model";

const ELOVATE_SERVE_STATIC = process.env.ELOVATE_SERVE_STATIC?.toLowerCase() === "false" ? false : true;

export enum Env {
    DEV = "development",
    PROD = "production"
}

export const app = express();

function getFreePort(port = 3000) {
    return port;
}

function exitApp(reason: string, code: number) {
    log.warn(`exiting app (${code}): ${reason}`);
    process.exit(code);
};


async function main() {
    Api.setLogger(log);
    const env = process.env.NODE_ENV;

    const logOutput = env === Env.DEV ? "dev" : "short";
    app.use(morgan(logOutput, {
        stream: {
            write: msg => {
                log.info(msg.trim());
            }
        }
    }));

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.set("views", path.join(__dirname, "..", "templates"));
    app.set("view engine", "pug");

    if (env === Env.DEV && ELOVATE_SERVE_STATIC) {
        try {
            let assetDir = process.env.ELOVATE_ASSET_DIR ?? path.join("dist", "public");
            if (! assetDir.startsWith("/")) {
                assetDir = path.join(appRoot.toString(), assetDir);
            }
            app.use(express.static(assetDir));
            log.info("serving static content");
        } catch (err) {
            log.error("err");
            exitApp("could not serve static content", 1);
        }
    }

    try {
        await connectDb();
        log.info("connected to database");

        if (process.env.ELOVATE_CLEAR_DB === "true") {
            const models = [
                Model.User,
                Model.Group,
                Model.Game,
                Model.MatchParty,
                Model.Match,
            ]

            models.forEach(async m => await Orm.getRepository(m).clear());
        }

        if (process.env.ELOVATE_POPULATE_TEST_DATA === "true") {
            Util.populateTestData();
        }
    } catch (err) {
        log.error(err);
        exitApp("could not connect to database", 1);
    }

    const dayInSeconds = 60 * 60 * 24;
    let sessionStore: SessionStore;
    try {
        sessionStore = new SessionStore({
            repository: Orm.getCustomRepository(SessionRepository),
            ttl: dayInSeconds,
            expirationInterval: dayInSeconds * 1000,
            clearExpired: true
        });
        log.info("initialized session store");
    } catch (err) {
        log.error(err);
        exitApp("could not initialize session store", 1);
    }

    if (! process.env.ELOVATE_SESSION_SECRET) {
        exitApp("ELOVATE_SESSION_SECRET environment variable must be defined", 1);
    } else {
        try {
            app.use(session({
                cookie: {
                    httpOnly: true,
                    //secure: true
                    secure: false // TODO: this will need rework when behind nginx
                },
                name: "elovate.sid",
                saveUninitialized: false,
                resave: false,
                secret: process.env.ELOVATE_SESSION_SECRET,
                store: sessionStore
            }));
            app.set("sessionStore", sessionStore);
        } catch (err) {
            log.error(err);
            exitApp("could not add session middleware", 1);
        }
    }

    app.use(routes);

    const port = getFreePort();
    try {
        app.listen(port);
        log.info(`listening on port ${ port }`);
    } catch (err) {
        log.error(err);
        exitApp(`could not set app to listen on port ${ port }`, 1);
    }
}

main();
