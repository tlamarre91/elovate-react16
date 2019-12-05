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

import { log } from "../log";
import {
    User,
    Match,
    ImageAsset,
    ImageAssetRepository
} from "../model";
import {
    UserProps,
} from "../../api";

import { apiRouter } from "./apiRouter";

const router = Router();

router.use("/api", apiRouter);

router.get("/", (req, res) => {
    log.info("got somethin here boss");
    res.render("dev-test");
});

router.get("/identicon/:token", async (req, res) => {
    const repo = getCustomRepository(ImageAssetRepository);
    const identicon: ImageAsset = await repo.getIdenticon(req.params["token"], 50);
    res.json({ "made": identicon.uri });
});

// router.get("/randomUser", (req: Request, res: Response) => {
//     User.getRandom().then(user => {
//         res.json({ user });
//     });
// });
export default router;
