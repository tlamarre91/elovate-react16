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
import {
    User,
    Match,
    ImageAsset
} from "~shared/model/entities";

import { ImageAssetRepository } from "~shared/model/repositories";

import { apiRouter } from "./apiRouter";

const router = Router();

router.use(Api.API_ROOT, apiRouter);

// TODO: factor out into webclientRouter module
router.get("/", async (req, res) => {
    log.info("got somethin here boss");
    const session = JSON.stringify(req.session);
    res.render("dev-test", { session });
});

router.get("/identicon/:token", async (req, res) => {
    const repo = Orm.getCustomRepository(ImageAssetRepository);
    const identicon: ImageAsset = await repo.getIdenticon(req.params["token"], 50);
    res.json({ made: identicon.uri });
});

router.get("/identicons", async (req, res) => {
    const repo = Orm.getCustomRepository(ImageAssetRepository);
    const identicons: ImageAsset[] = await repo.find();
    res.render("identicon-test", { assets: identicons });
});

//router.get("/setval/:val", async (req, res) => {
//    const val = req.params["val"];
//    req.session["testProp"] = val;
//    res.send(`set val: ${val}`);
//});
//
//router.get("/getval", async (req, res) => {
//    const val = req.session["testProp"];
//    res.json({ val, msg: "what" });
//});

//router.get("/clearSessions", async (req, res) => {
//    const sessionStore: SessionStore = app.get("sessionStore");
//    sessionStore.clear(err => {
//        if (err) res.json({ success: false });
//        else res.json({ success: true });
//    });
//});

router.get("/user/:query", async (req, res) => {
    // TODO: return proper http status code, use express-validator
    // TODO: just do parseInt and use isNaN, ya dingus
    const repo = Orm.getRepository(User);
    const template = "user-profile";
    const query = req.params["query"];

    if (query.includes("=")) {
        res.render(template, { error: "gotta enter an id, sorry" }); // TODO: keyval user query
    } else {
        const re = /^[0-9]*$/;
        const idStr = query.match(re)?.[0] ?? null;
        if (idStr !== null) {
            const id = parseInt(idStr);
            const user = await repo.findOne(id);
            if (user) {
                res.render(template, { user });
            } else {
                res.render(template, { error: "user not found" });
            }
        } else {
            res.render(template, { error: "enter a NUMERIC id" }); // TODO: obvious
        }
    }
});

export default router;
