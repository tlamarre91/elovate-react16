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

//router.get("/api/searchUsers", (req, res) => { res.json({ WHAT: "WHAT THE FUUUUUCK" }) });

router.get("/", (req: Request, res: Response) => {
    log.info("got somethin here boss");
    res.render("base");
});

router.get("/randomUser", (req: Request, res: Response) => {
    User.getRandom().then(user => {
        res.json({ user });
    });
});

router.post("/addUser", (req: Request, res: Response) => {
    //const username: string = req.body["username"];
    //const userProps = new User(req.body as UserProps);
    const userProps: UserProps = req.body;
    const user = new User(userProps);
    //user.username = req.body["username"];
    getRepository(User).save(user).then(user => res.json(user));
});

router.post("/addMatch", (req: Request, res: Response) => {
    const matchName = req.body["name"];
    const match = new Match();
    match.name = matchName;
    getRepository(Match).save(match);
    res.json({ match });
});

export default router;
