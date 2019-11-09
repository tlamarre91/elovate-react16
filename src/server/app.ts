import appRoot from "app-root-path";
import bodyParser from "body-parser";
import express from "express";
// import createError from "http-errors";
import morgan from "morgan";
import path from "path";
import winston from "winston";

import { connectDb } from "./db";
import routes from "./routes";

function getFreePort(port = 3000) {
    return port;
}

async function main() {
    const app = express();
    const port = getFreePort();

    const log: winston.Logger = winston.createLogger({
        level: "info",
        format: winston.format.json(),
        transports: [
            new winston.transports.File({ filename: `${appRoot}/logs/error.log`, level: "error" }),
            new winston.transports.File({ filename: `${appRoot}/logs/combined.log` })
        ]
    });

    if (process.env.NODE_ENV !== "production") {
        log.add(new winston.transports.Console({
            format: winston.format.simple()
        }));
    }

    const morganOpts: morgan.Options = {
        stream: {
            write: msg => {
                log.info(msg.trim());
            }
        }
    }

    app.use(morgan("dev", morganOpts));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.set("views", path.join(__dirname, "templates"));
    app.set("view engine", "pug");

    const staticDir = `${appRoot}/dist/client`;
    app.use(express.static(staticDir));

    try {
        await connectDb();
        log.info("connected to database");
    } catch (e) {
        log.error("could not connect to database");
        log.error(e);
        process.exit(1);
    }

    app.use(routes(log));
    app.listen(port);
}

main();
