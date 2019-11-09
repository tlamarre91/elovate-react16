import { Router } from "express";
import { getRepository } from "typeorm";
import { Logger } from "winston";
import { LoremIpsum } from "lorem-ipsum";

import { User } from "../model";

export default function(log: Logger) {
    const routes = Router();

    routes.get("/", (req, res) => {
        log.info("get request");
        res.render("base");
    });

    return routes;
}
