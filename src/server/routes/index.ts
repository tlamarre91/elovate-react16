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

import {
    getRepository,
    getCustomRepository,
    Like
} from "typeorm";

import { LoremIpsum } from "lorem-ipsum";

import { app } from "../app";
import { log } from "../log";
import {
    User,
    Match,
    ImageAsset,
    ImageAssetRepository,
    SessionStore
} from "../model";
import {
    UserProps,
} from "../../api";

import { apiRouter } from "./apiRouter";

const router = Router();

router.use("/api", apiRouter);

router.get("/", async (req, res) => {
    log.info("got somethin here boss");
    res.render("dev-test");
});

router.get("/identicon/:token", async (req, res) => {
    const repo = getCustomRepository(ImageAssetRepository);
    const identicon: ImageAsset = await repo.getIdenticon(req.params["token"], 50);
    res.json({ made: identicon.uri });
});

router.get("/identicons", async (req, res) => {
    const repo = getCustomRepository(ImageAssetRepository);
    const identicons: ImageAsset[] = await repo.find();
    res.render("identicon-test", { assets: identicons });
});

router.get("/clearSessions", async (req, res) => {
    const sessionStore: SessionStore = app.get("sessionStore");
    sessionStore.clear(err => {
        if (err) res.json({ success: false });
        else res.json({ success: true });
    });
});

export default router;
