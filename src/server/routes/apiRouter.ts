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
import {
    User,
    Group,
    Game,
    Match,
} from "../model";

import * as Api from "../../api";

export const apiRouter = Router();

async function searchUsers(params: Api.UserSearchParams): Promise<Api.ApiResponse<Api.UserProps[]>> {
    const userRepo = getRepository(User);
    if (params.searchType === Api.SearchType.ContainsAll) {
        const users = await userRepo.find({
            username: Like(`%${ params.searchProps.username }%`) // TODO: Factor out, check each field in Partial<UserProps>
        });

        const userPropsList: Api.UserProps[] = users.map((u: User) => u.toProps());

        return {
            success: true,
            error: null,
            data: userPropsList
        };
    } else {
        const err = `match type not yet implemented: ${ params.searchType }`;
        log.error(err);
        throw Error(err);
    }
}

apiRouter.get(Api.Endpoint.SearchUsers,
              sanitizeQuery(["username"]).escape(),
              async (req, res) => {
                  const errors = validationResult(req);
                  const params = Api.UserSearchParams.fromQuery(req.query);
                  searchUsers(params)
                    .then(ret => res.json(ret))
                    .catch(err => res.json(new Api.ApiError<Api.UserProps[]>(err)));
              });

// async function addUser(props: Partial<Api.UserProps>): Promise<Api.ApiResponse<Api.UserProps>> {
//     try {
//         const userRepo = getRepository(User);
//         const newUser = await userRepo.save(new User(props));
//         return {
//             success: true,
//             error: null,
//             data: newUser
//         };
//     } catch (err) {
//         log.error(err);
//         throw err;
//     }
// }
// 
// apiRouter.post(Api.Endpoint.AddUser,
//                sanitizeBody(["username", "displayName", "email"]),
//                async (req, res) => {
//                    log.info(JSON.stringify(req.body));
//                    const props: Partial<Api.UserProps> = {
//                        ... req.body.data
//                    };
//                    log.info(JSON.stringify(props));
//                    addUser(props)
//                        .then(ret => res.json(ret))
//                        .catch(err => res.json(new Api.ApiError<Api.UserProps[]>(err)));
//                });
