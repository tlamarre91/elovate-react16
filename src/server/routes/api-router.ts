import { Router } from "express";

import {
    sanitizeBody,
    sanitizeParam,
    sanitizeQuery,
    validationResult,
    Result
} from "express-validator";

import * as Orm from "typeorm";

import { LoremIpsum } from "lorem-ipsum";

import { log } from "../log";

import * as Entity from "~shared/model/entities";
import { UserRepository } from "~shared/model/repositories";
import { Authorization } from "~server/middleware";

import * as Api from "~shared/api";
//import * as Util from "~server/util";

export const apiRouter = Router();

apiRouter.post("/auth", async (req, res) => {
    log.info(JSON.stringify(req.body));
    if (req.body["auth-method"] === "basic") {
        const username = req.body["username"];
        const password = req.body["password"];
        const userRepo = Orm.getCustomRepository(UserRepository);
        const user = await userRepo.find({ username }).then(res => res[0]);
        const isWebClient = req.body["client"] === "web";
        if (user) {
            if (await userRepo.basicAuth(user, password)) {
                // TODO: don't necessarily assign refresh: true to all JWTs...
                const newToken = Authorization.generateUserJwt(user.id, req.app.get("secret"), true);
                res.cookie("elovateJwt", newToken, { signed: true });
                if (isWebClient) {
                    if (req.query["redirect"]) {
                        res.redirect(req.query["redirect"]); // TODO: nice fancy interactive login
                    } else {
                        res.redirect("/");
                    }
                } else {
                    res.json(new Api.Response(true, null, { result: `authenticated as ${username}` }));
                }
            } else {
                res.status(403);
                if (isWebClient) {
                    res.redirect(`/login?msg=${ encodeURIComponent("username/password combination was invalid") }`);
                } else {
                    res.json(new Api.Response(false, `invalid username/password`));
                }
            }
        } else {
            res.status(404);
            if (isWebClient) {
                res.redirect(`/login?msg=${ encodeURIComponent("user/password combination was invalid") }`);
            } else {
                res.json(new Api.Response(false, `user not found: ${ username }`));
            }
        }
    } else {
        res.status(401)
        res.json(new Api.Response(false, `auth method not supported: ${ req.body["auth-method"] }`));
    }
})

apiRouter.post("/deauth", async (req, res) => {
    if (req.user) {
        const userRepo = Orm.getCustomRepository(UserRepository)
    }
});

const userRouter = Router();
userRouter.post(`/setPassword`, async (req, res) => {
    const { username, password } = req.body;
    const userRepo = Orm.getCustomRepository(UserRepository);
    try {
        const user = await userRepo.find({ username })
            .then(res => res[0])
            .catch(err => {
                throw `user not found: ${username}`
            });
        userRepo.setPassword(user, password);
        res.json(new Api.Response(true, null, { message: "new password set" }));
    } catch (err) {
        res.json(new Api.Response(false, err));
    }
});

apiRouter.use(`/${Api.Resource.User}`, userRouter);


//apiRouter.get(Api.Endpoint.SearchUsers, sanitizeQuery(["username"]).escape(), async (req, res) => {
//    const errors = validationResult(req);
//    const params = Api.UserSearchParams.fromQuery(req.query);
//
//    const repo = getCustomRepository(Model.UserRepository);
//    repo.search(params)
//    // TODO: SECURITY RISK. should actually be sending some Pick<Model.User>
//        .then(users => {
//            res.json(new Api.ApiSuccess<Partial<Model.User>[]>(users));
//        })
//        .catch(err => {
//            log.error(err);
//            res.json(new Api.ApiError<Partial<Model.User>[]>(err));
//        });
//});

//apiRouter.post(Api.Endpoint.AddUser, sanitizeBody(["username", "displayName", "email"]), async (req, res) => {
//    const user: Model.User = {
//        ... req.body.data, hasAccount: false
//    };
//
//    const repo = getCustomRepository(Model.UserRepository);
//    repo.createWithProps(props)
//        .then(user => {
//            res.json(new Api.ApiSuccess<Props.UserProps>(user));
//        })
//        .catch(err => {
//            log.error(err);
//            res.json(new Api.ApiError<Props.UserProps>(err));
//        });
//});

//apiRouter.delete(Api.Endpoint.DeleteUser, sanitizeBody(["username", "id"]), async (req, res) => {
//    res.json(new Api.ApiError("not implemented adsfjfj!"));
//});
