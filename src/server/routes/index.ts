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
    const session = JSON.stringify(req.session);
    res.render("dev-test", { session });
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

router.get("/setval/:val", async (req, res) => {
    const val = req.params["val"];
    req.session["testProp"] = val;
    res.send(`set val: ${val}`);
});

router.get("/getval", async (req, res) => {
    const val = req.session["testProp"];
    res.json({ val, msg: "what" });
});

router.get("/clearSessions", async (req, res) => {
    const sessionStore: SessionStore = app.get("sessionStore");
    sessionStore.clear(err => {
        if (err) res.json({ success: false });
        else res.json({ success: true });
    });
});

export default router;
