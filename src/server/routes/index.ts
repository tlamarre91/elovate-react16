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
    Like
} from "typeorm";

import { LoremIpsum } from "lorem-ipsum";

import { log } from "../log";
import { User, Match } from "../model";
import {
    UserProps,
} from "../../api";

import { apiRouter } from "./apiRouter";

const router = Router();

router.use("/api", apiRouter);

router.get("/", (req: Request, res: Response) => {
    log.info("got somethin here boss");
    res.render("base");
});

router.get("/randomUser", (req: Request, res: Response) => {
    User.getRandom().then(user => {
        res.json({ user });
    });
});
export default router;
