import "module-alias/register"; // required to allow module path aliases (i.e. "~shared" -> "dist/shared")
import appRoot from "app-root-path";
import bodyParser from "body-parser";
import express from "express";
import cookieParser from "cookie-parser";
import createError from "http-errors";
import morgan from "morgan";
import path from "path";
import jwt from "jsonwebtoken";
import fav from "serve-favicon";
import * as Orm from "typeorm";
import dotenv from "dotenv";
dotenv.config();

import * as Util from "~server/util";
import { log } from "~server/log";
import * as Api from "~shared/api";
import * as jwtManager from "~server/middleware";

import { connectDb } from "~server/db";
import routes from "~server/routes";
// import { SessionStore, SessionRepository } from "~shared/model/repositories";
import * as Entity from "~shared/model/entities";
import { UserRepository } from "~shared/model/repositories";

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

    if (env === Env.DEV && ELOVATE_SERVE_STATIC) {
        try {
            let assetDir = process.env.ELOVATE_ASSET_DIR ?? path.join("dist", "public");
            if (! assetDir.startsWith("/")) {
                assetDir = path.join(appRoot.toString(), assetDir);
            }
            app.use(express.static(assetDir));
            app.use(fav(path.join(assetDir, "img", "elovate-16x16.png"))); // TODO: make favicon serving less terrible
            log.info("serving static content");
        } catch (error) {
            log.error(error);
            exitApp("could not serve static content", 1);
        }
    }

    app.set("secret", process.env.ELOVATE_SESSION_SECRET);

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    
    app.use(cookieParser(process.env.ELOVATE_SESSION_SECRET));

    app.set("views", path.join(__dirname, "..", "templates"));
    app.set("view engine", "pug");

    try {
        await connectDb();
        log.info("connected to database");

        // TODO: make an external script to do this (and to clear DB)
        // if (process.env.ELOVATE_POPULATE_TEST_DATA === "true") {
        //     Util.populateTestData();
        // }
    } catch (error) {
        log.error(error);
        exitApp("could not connect to database", 1);
    }

    app.use(jwtManager.init(Orm.getCustomRepository(UserRepository)));

    app.use(routes);

    const port = getFreePort();
    try {
        app.listen(port);
        log.info(`listening on port ${ port }`);
    } catch (error) {
        log.error(error);
        exitApp(`could not set app to listen on port ${ port }`, 1);
    }
}

main();
