import {
    Router,
    Request,
    Response
} from "express";

import {
    sanitizeBody,
    sanitizeParam,
    sanitizeQuery,
    validationResult,
    Result
} from "express-validator";

import {
    getCustomRepository,
    Like
} from "typeorm";

import { LoremIpsum } from "lorem-ipsum";

import { log } from "../log";
//import {
//    User,
//    Group,
//    Game,
//    Match,
//} from "../model";

import * as Model from "../model";

import * as Api from "~shared/api";
import * as Props from "~shared/props";

export const apiRouter = Router();

apiRouter.get(Api.Endpoint.SearchUsers, sanitizeQuery(["username"]).escape(), async (req, res) => {
    const errors = validationResult(req);
    const params = Api.UserSearchParams.fromQuery(req.query);

    const repo = getCustomRepository(Model.UserRepository);
    repo.search(params)
        .then(users => {
            res.json(new Api.ApiSuccess<Props.UserProps[]>(users.map(u => u.toProps())));
        })
        .catch(err => {
            log.error(err);
            res.json(new Api.ApiError<Props.UserProps[]>(err));
        });
});

apiRouter.post(Api.Endpoint.AddUser, sanitizeBody(["username", "displayName", "email"]), async (req, res) => {
    const props: Props.UserProps = {
        ... req.body.data, hasAccount: false
    };

    const repo = getCustomRepository(Model.UserRepository);
    repo.createWithProps(props)
        .then(user => {
            res.json(new Api.ApiSuccess<Props.UserProps>(user));
        })
        .catch(err => {
            log.error(err);
            res.json(new Api.ApiError<Props.UserProps>(err));
        });
});

apiRouter.delete(Api.Endpoint.DeleteUser, sanitizeBody(["username", "id"]), async (req, res) => {
    res.json(new Api.ApiError("not implemented adsfjfj!"));
});
