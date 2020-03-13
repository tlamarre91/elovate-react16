import { Router, Request, Response, NextFunction } from "express";
import * as Orm from "typeorm";

import { log } from "~shared/log";
import * as Api from "~shared/api";
import * as Entity from "~shared/model/entities";
import * as Repository from "~shared/model/repositories";
import * as Dto from "~shared/model/data-transfer-objects";

async function userQueryMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const query = req.params["query"];
        const user = await Orm.getCustomRepository(Repository.UserRepository).findOneFromQuery(query);

        if (! user) {
            res.status(404);
            return res.json(new Api.Response(false, `user not found: ${query}`));
        }

        if (!(req.user.id === user.id || user.publicVisible || req.user.isAdmin)) {
            res.status(403);
            res.json(new Api.Response(false, "not authorized"));
        } else {
            req.resource = user;
            return next();
        }
    } catch (err) {
        log.error(`userQueryMiddleware: ${err}`);
        res.status(500);
        res.json(new Api.Response(false, err));
    }
}

const router = Router();
router.get("/all", async (req, res) => {
    if (req?.user?.isAdmin) {
        const users = await Orm.getRepository(Entity.User).find();
        res.json(new Api.Response(true, null, users.map(u => new Dto.UserDto(u))));
    } else {
        const users = await Orm.getRepository(Entity.User).find({ where: { publicVisible: true } });
        res.json(new Api.Response(true, null, users.map(u => new Dto.UserDto(u))));
    }
});

router.get("/:query", userQueryMiddleware, async (req, res) => {
    if (req.resource) {
        res.json(new Api.Response(true, null, new Dto.UserDto(req.resource as Entity.User)));
    }
});

router.post("/", async (req, res) => {
    if (req?.user?.isAdmin) {
        try {
            const dto = req.body as Dto.UserDto;
            const userRepo = Orm.getCustomRepository(Repository.UserRepository);
            const existingUser = userRepo.findOne(dto.id);
            if (existingUser) {
                res.status(409);
                res.json(new Api.Response(false, "user ${dto.id} already exists"));
            } else {
                const user = await userRepo.createFromDto(dto);
                return userRepo.save(user);
            }
        } catch (err) {
            log.error(`POST /users: ${err}`);
            res.status(500);
            res.json(new Api.Response(false, "server error"));
        }
    } else {
        res.status(403);
        res.json(new Api.Response(false, "not authorized"));
    }
});

router.put("/:id", async (req, res) => {
});

//router.post(`/:query/setPassword`, async (req, res) => {
//    const { username, password } = req.body;
//    const userRepo = Orm.getCustomRepository(Repository.UserRepository);
//    try {
//        const user = await userRepo.find({ username })
//            .then(res => res[0])
//            .catch(err => {
//                throw `user not found: ${username}`
//            });
//        userRepo.setPassword(user, password);
//        res.json(new Api.Response(true, null, { message: "new password set" }));
//    } catch (err) {
//        res.json(new Api.Response(false, err));
//    }
//});

export default router;
