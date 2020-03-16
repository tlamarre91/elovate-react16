import { Router, Request, Response, NextFunction } from "express";
import * as Orm from "typeorm";

import { log } from "~shared/log";
import * as Api from "~shared/api";
import * as Repository from "~shared/model/repositories";
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

router.get("/availability/email/:query", async (req, res) => {
    Orm.getRepository(User).find({ where: { email: req.params["query"] } }).then(result => {
        if (result.length > 0) {
            res.json(new Api.Response(true, null, true));
        } else {
            res.json(new Api.Response(true, null, false));
        }
    });
});

router.get("/availability/username/:query", async (req, res) => {
    try {
        Orm.getRepository(User).find({ where: { username: req.params["query"] } }).then(result => {
            if (result.length === 0) {
                res.json(new Api.Response(true, null, true));
            } else {
                res.json(new Api.Response(true, null, false));
            }
        });
    } catch (err) {
        res.status(500);
        res.json(new Api.Response(false, err));
    }
});

router.post("/register", async (req, res) => {
    if (req.user) {
        res.status(403);
        // TODO: fix error string :)
        res.json(new Api.Response(false, "You are already logged in. To manage group users, go to ______",));
    } else {
        const dto = req.body as Dto.UserDto;
        const userRepo = Orm.getCustomRepository(Repository.UserRepository);
        let collision: boolean = await userRepo.find({
            where: [
                { username: dto.username },
                { email: dto.email }
            ]
        }).then(result => result.length < 0);

        if (collision) {
            res.status(409);
            res.json(new Api.Response(false, "username or email already in use"));
        } else {
            const user = await userRepo.createFromDto(dto);
        }
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
    throw new Error("nope");
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
