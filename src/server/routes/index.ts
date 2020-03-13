import { Router, Request, Response, NextFunction } from "express";

import {
    sanitizeBody,
    sanitizeParam,
    sanitizeQuery,
    validationResult,
    Result
} from "express-validator";

import * as Orm from "typeorm";

import { LoremIpsum } from "lorem-ipsum";

import { log } from "~shared/log";

import * as Entity from "~shared/model/entities";
import * as Dto from "~shared/model/data-transfer-objects";
import { UserRepository } from "~shared/model/repositories";
import { Authorization } from "~server/middleware";

import * as Api from "~shared/api";
import userRouter from "./users";
import groupRouter from "./groups";

export const baseRouter = Router();
export const apiRouter = Router();
baseRouter.use(Api.API_ROOT, apiRouter);

apiRouter.post(`/${Api.Resource.Authentication}`, async (req, res) => {
    log.info(JSON.stringify(req.body));
    if (req.body["data"]["auth-method"] === "basic") {
        const username = req.body["data"]["username"];
        const password = req.body["data"]["password"];
        const userRepo = Orm.getCustomRepository(UserRepository);
        const user = await userRepo.find({ username }).then(res => res[0]);
        const isWebFallbackClient = req.body["client"] === "web-fallback";
        if (user) {
            if (await userRepo.basicAuth(user, password)) {
                // TODO: don't necessarily assign refresh: true to all JWTs...
                const newToken = Authorization.generateUserJwt(user.id, req.app.get("secret"), true);
                res.cookie(Authorization.JWT_COOKIE_NAME, newToken, { signed: true });
                if (isWebFallbackClient) {
                    if (req.query["redirect"]) {
                        res.redirect(req.query["redirect"]);
                    } else {
                        res.redirect("/");
                    }
                } else {
                    res.json(new Api.Response(true, null, new Dto.UserDto(user)));
                }
            } else {
                res.status(403);
                if (isWebFallbackClient) {
                    res.redirect(`/login?msg=${ encodeURIComponent("username/password combination was invalid") }`);
                } else {
                    res.json(new Api.Response(false, `invalid username and/or password`));
                }
            }
        } else {
            res.status(404);
            if (isWebFallbackClient) {
                res.redirect(`/login?msg=${ encodeURIComponent("user/password combination was invalid") }`);
            } else {
                log.info(`user not found: ${username}`);
                res.json(new Api.Response(false, "invalid username and/or password"));
            }
        }
    } else {
        res.status(401)
        res.json(new Api.Response(false, `auth method not supported: ${ req.body["auth-method"] }`));
    }
});

apiRouter.get(`/${Api.Resource.WhoAmI}`, async (req, res) => {
    try {
        if (req.user) {
            res.json(new Api.Response(true, null, new Dto.UserDto(req.user)));
        } else {
            res.status(403);
            res.json(new Api.Response(false, "not logged in"));
        }
    } catch (err) {
        res.status(500);
        res.json(new Api.Response(false, err));
    }
});

apiRouter.get("/deauth", async (req, res) => {
    if (req.user) {
        const userRepo = Orm.getCustomRepository(UserRepository)
        try {
            log.info(`invalidating logins for ${req.user}`);
            await userRepo.invalidateLogins(req.user);
            if (req.query["redirect"]) {
                res.redirect(req.query["redirect"]);
            } else {
                res.json(new Api.Response(true, null, `logged out as ${req.user.id}`));
            }
        } catch (err) {
            res.status(500);
            res.json(new Api.Response(false, `could not authenticate: ${err}`));
        }
    }
});

apiRouter.use(`/${Api.Resource.User}`, userRouter);
apiRouter.use(`/${Api.Resource.Group}`, groupRouter);

// TODO: exclude paths for static directories
// i'll eventually have a static site generator, deploying to directories like "blog"
// and "landing-site" and whatnot
baseRouter.get("/*", async (req, res) => {
    res.render("base", { user: req.user });
});
export default baseRouter;
