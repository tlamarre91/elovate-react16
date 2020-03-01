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

import * as Orm from "typeorm";

import { LoremIpsum } from "lorem-ipsum";

import { log } from "../log";

import * as Entity from "~shared/model/entities";

import * as Api from "~shared/api";

export const apiRouter = Router();

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

apiRouter.delete(Api.Endpoint.DeleteUser, sanitizeBody(["username", "id"]), async (req, res) => {
    res.json(new Api.ApiError("not implemented adsfjfj!"));
});
