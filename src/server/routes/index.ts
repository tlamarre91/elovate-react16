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
import { log } from "~server/log";

import * as Entity from "~shared/model/entities";

import userRouter from "./user-router";
import groupRouter from "./group-router";

// import { ImageAssetRepository } from "~shared/model/repositories";

import { apiRouter } from "./api-router";

const router = Router();

router.use(Api.API_ROOT, apiRouter);
router.use("/users", userRouter);
router.use("/groups", groupRouter);

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

export default router;
