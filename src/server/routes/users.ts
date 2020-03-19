import { Router, Request, Response, NextFunction } from "express";
import * as Orm from "typeorm";

import { log } from "~shared/log";
import * as Api from "~shared/api";
import { UserRepository } from "~shared/model/repositories";
import * as Dto from "~shared/model/data-transfer-objects";

import { User } from "~shared/model/entities/User";

const router = Router();

router.get("/all", async (req, res) => {
    if (req?.user?.isAdmin) {
        const users = await Orm.getRepository(User).find();
        res.json(new Api.Response(true, null, users.map(u => new Dto.UserDto(u))));
    } else {
        const users = await Orm.getRepository(User).find({ where: { publicVisible: true } });
        res.json(new Api.Response(true, null, users.map(u => new Dto.UserDto(u))));
    }
});

router.get("/:query", async (req, res) => {
    throw new Error("not implemented");
});

router.post("/validateNewUser", async (req, res) => {
    try {
        const userRepo = Orm.getCustomRepository(UserRepository);
        const errors = await userRepo.validateNewUser(req.body.data);
        res.json(new Api.Response(true, null, errors));
    } catch (err) {
        res.status(500);
        res.json(new Api.Response(false, err));
    }
});

async function registerEndpoint(req: Request, res: Response) {
    if (req.user) {
        res.status(403);
        // TODO: fix error string :)
        const str = "You are already logged in. To manage group users, go to ______";
        return res.json(new Api.Response(false, str));
    }

    try {
        const params = req.body.data;
        const userRepo = Orm.getCustomRepository(UserRepository);
        const errors = await userRepo.validateNewUser(params);
        if (errors?.username || errors?.email || errors?.password) {
            res.status(400);
            return res.json(new Api.Response(false, "invalid parameters"));
        } 

        const user: User = await userRepo.register(params);
        res.json(new Api.Response(true, null, new Dto.UserDto(user)));
    } catch (err) {
        res.status(500);
        log.error(`registerEndpoint: ${err}`);
        res.json(new Api.Response(false, "server error"));
    }
}

router.post("/register", registerEndpoint);

router.post("/", async (req, res) => {
    if (req?.user?.isAdmin) {
        try {
            const dto = req.body as Dto.UserDto;
            const userRepo = Orm.getCustomRepository(UserRepository);
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
    throw new Error("nope");
});

router.get("/*", async (req, res) => {
    res.status(404);
    res.json(new Api.Response(false, "resource not found"));
});

export default router;
