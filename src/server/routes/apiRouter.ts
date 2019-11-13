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
    getRepository,
    Like
} from "typeorm";

import { LoremIpsum } from "lorem-ipsum";

import { log } from "../log";
import { User, Match } from "../model";
import {
    Endpoint,
    UserProps,
    UserSearchParams,
    ApiResponse,
    ApiError
} from "../../api";

export const apiRouter = Router();

async function searchUsers(params: UserSearchParams): Promise<ApiResponse<UserProps[]>> {
    const userRepo = getRepository(User);
    if (params.match === "contains") {
        const users = await userRepo.find({
            username: Like (`%${ params.value }%`)
        });

        const userPropsList: UserProps[] = users.map((u: User) => u as UserProps);

        return {
            success: true,
            error: null,
            data: userPropsList
        };
    } else {
        const err = `match type not yet implemented: ${ params.match }`;
        log.error(err);
        throw Error(err);
    }
}

apiRouter.get(Endpoint.SearchUsers,
              sanitizeQuery(["searchString"]).escape(),
              async (req, res) => {
                  const errors = validationResult(req);
                  const params = req.query as UserSearchParams;
                  res.json(await searchUsers(params));
              });

apiRouter.post(Endpoint.AddUser,
               sanitizeBody(["username", "displayName", "email"]),
               async (req, res) => {
                   res.json(new ApiError<UserProps>("endpoint not implemented"));
               });
