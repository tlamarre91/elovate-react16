import 'module-alias/register'; // required to allow module path aliases (i.e. "~shared" -> "dist/shared")
import appRoot from 'app-root-path';
import bodyParser from 'body-parser';
import express from 'express';
import cookieParser from 'cookie-parser';
import createError from 'http-errors';
import morgan from 'morgan';
import path from 'path';
import favicon from 'serve-favicon';
import * as Orm from 'typeorm';
import dotenv from 'dotenv';

import * as Util from '~server/util';
import { log } from '~shared/log';
import * as Api from '~shared/api';
import { Authorization } from '~server/middleware';

import { connectDb } from '~server/db';
import routes from '~server/routes';
import { UserRepository } from '~server/model/repositories';

dotenv.config();

const ELOVATE_SERVE_STATIC = process.env.ELOVATE_SERVE_STATIC?.toLowerCase() !== 'false';

export enum Env {
    DEV = 'development',
    PROD = 'production',
}

export const app = express();

function getFreePort(port = 3000) {
    return port;
}

function exitApp(reason: string, code: number) {
    log.warn(`exiting app (${code}): ${reason}`);
    process.exit(code);
}

async function main() {
    // app.set("config", import(path.resolve(appRoot.toString(), "config.json")));
    const env = process.env.NODE_ENV;

    const logOutput = env === Env.DEV ? 'dev' : 'short';
    app.use(
        morgan(logOutput, {
            stream: {
                write: (msg) => {
                    log.info(msg.trim());
                },
            },
        }),
    );

    if (env === Env.DEV && ELOVATE_SERVE_STATIC) {
        try {
            let assetDir = process.env.ELOVATE_ASSET_DIR ?? path.join('dist', 'public');
            if (!assetDir.startsWith('/')) {
                assetDir = path.join(appRoot.toString(), assetDir);
            }
            app.use(express.static(assetDir));
            app.use(favicon(path.join(assetDir, 'img', 'elovate-16x16.png'))); // TODO: make favicon serving less terrible
            log.info('serving static content');
        } catch (error) {
            log.error(error);
            exitApp('could not serve static content', 1);
        }
    }

    app.set('secret', process.env.ELOVATE_SESSION_SECRET);

    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use(cookieParser(process.env.ELOVATE_SESSION_SECRET));

    app.set('views', path.join(__dirname, '..', 'templates'));
    app.set('view engine', 'pug');

    try {
        await connectDb();
        log.info('connected to database');

        // TODO: make an external script to do this (and to clear DB)
        if (process.env.ELOVATE_POPULATE_TEST_DATA === 'true') {
            Util.populateTestData();
        }

        // TODO: don't change this, ever. it's perfect this way
        if (process.env.ELOVATE_ADD_DEFAULT_ADMIN === 'true') {
            try {
                await Orm.getCustomRepository(UserRepository).insertAdmin();
            } catch (err) {
                log.warn(err);
            }
        }
    } catch (error) {
        log.error(error);
        exitApp('could not connect to database', 1);
    }

    app.use(Authorization.init(Orm.getCustomRepository(UserRepository)));

    app.use(routes);

    const port = getFreePort();
    try {
        app.listen(port);
        log.info(`listening on port ${port}`);
    } catch (error) {
        log.error(error);
        exitApp(`could not set app to listen on port ${port}`, 1);
    }
}

main();
