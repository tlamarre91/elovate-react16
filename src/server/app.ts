import appRoot from "app-root-path";
import bodyParser from "body-parser";
import express from "express";
import createError from "http-errors";
import morgan from "morgan";
import path from "path";
import session from "express-session";

import { getRepository } from "typeorm";
import { log } from "./log";
import * as Api from "../api";

import { connectDb } from "./db";
import routes from "./routes";
import { SessionStore, Session } from "./model/Session";

// TODO
function getFreePort(port = 3000) {
    return port;
}

function exitApp(reason: string, code: number) {
    log.info(`exiting app: ${reason}`);
    process.exit(code);
};

const morganOpts: morgan.Options = {
    stream: {
        write: msg => {
            log.info(msg.trim());
        }
    }
}

let sessionStore: SessionStore;

export const app = express();
const port = getFreePort();

Api.setLogger(log);
app.use(morgan("dev", morganOpts));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.set("views", path.join(__dirname, "templates"));
app.set("view engine", "pug");

const staticDir1 = path.join(appRoot.toString(), "dist", "client"); // TODO: make gulp just put bundle in public
app.use(express.static(staticDir1)); // TODO: won't be serving static through express anyway

const staticDir2 = path.join(appRoot.toString(), "dist", "public");
app.use(express.static(staticDir2));

connectDb().then(() => {
    const day = 60* 60 * 24;
    sessionStore = new SessionStore({
        repository: getRepository(Session),
        ttl: day,
        expirationInterval: day,
        clearExpired: true
    });

    app.use(session({
        cookie: {
            httpOnly: true,
            secure: true
        },
        name: "elovate.sid",
        saveUninitialized: false,
        secret: "elovate_secretfj4dfsa00splkfjzvnklf!!dddd", // TODO: generate a seeeeecret
        store: sessionStore
    }));

    app.set("sessionStore", sessionStore);

    app.use(routes);
    app.listen(port);
}).catch(err => {
    log.error(err);
    exitApp("could not connect to database", 1);
});
