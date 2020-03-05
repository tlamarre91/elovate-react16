import {
    Router,
    Request,
    Response
} from "express";

import {
    sanitizeBody,
    sanitizeParam,
    validationResult,
    Result
} from "express-validator";

import * as Orm from "typeorm";

import { LoremIpsum } from "lorem-ipsum";

import * as Api from "~shared/api";
import { app } from "~server/app";
import { log } from "~server/log";

import * as Entity from "~shared/model/entities";
import * as Dto from "~shared/model/data-transfer-objects";

// import { ImageAssetRepository } from "~shared/model/repositories";

import { apiRouter } from "./apiRouter";

const router = Router();

router.use(Api.API_ROOT, apiRouter);

// TODO: factor out into webclientRouter module
router.get("/", async (req, res) => {
    res.render("base", { user: req.user });
});

router.get("/login", async (req, res) => {
    const user = req.user;
    res.render("login", { user });
});

// router.get("/identicon/:token", async (req, res) => {
//     const repo = Orm.getCustomRepository(ImageAssetRepository);
//     const identicon: ImageAsset = await repo.getIdenticon(req.params["token"], 50);
//     res.json({ made: identicon.uri });
// });
// 
// router.get("/identicons", async (req, res) => {
//     const repo = Orm.getCustomRepository(ImageAssetRepository);
//     const identicons: ImageAsset[] = await repo.find();
//     res.render("identicon-test", { assets: identicons });
// });

router.get("/users/:query", async (req, res) => {
    // TODO: return proper http status code, use express-validator
    // TODO: just do parseInt and use isNaN, ya dingus
    const repo = Orm.getRepository(Entity.User);
    const template = "user-profile";
    const query = req.params["query"];

    if (query.includes("=")) {
        res.status(404);
        res.render(template, { error: "gotta use an id, sorry" }); // TODO: keyval user query
    } else {
        const re = /^[0-9]*$/;
        const idStr = query.match(re)?.[0] ?? null;
        if (idStr !== null) {
            const id = parseInt(idStr);
            const user = new Dto.UserDto(await repo.findOne(id));
            if (user) {
                res.render(template, { user });
            } else {
                res.render(template, { error: "user not found" });
            }
        } else {
            res.status(404);
            res.render(template, { error: "use a NUMERIC id" }); // TODO: obvious
        }
    }
});

export default router;
