import appRoot from "app-root-path";
import bodyParser from "body-parser";
import express from "express";
import createError from "http-errors";
import morgan from "morgan";
import path from "path";
import { log } from "./log";

import { connectDb } from "./db";
import routes from "./routes";

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

async function main() {
    const app = express();
    const port = getFreePort();

    app.use(morgan("dev", morganOpts));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.set("views", path.join(__dirname, "templates"));
    app.set("view engine", "pug");

    const staticDir = `${appRoot}/dist/client`;
    app.use(express.static(staticDir));

    connectDb().then(() => {
        app.use(routes);
        app.listen(port);
    }).catch(err => {
        log.error(err);
        exitApp("could not connect to database", 1);
    });
}

main();
