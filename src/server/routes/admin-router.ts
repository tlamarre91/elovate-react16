import { Router, Request, Response, NextFunction } from "express";
import * as Orm from "typeorm";

import * as Api from "~shared/api";
import { log } from "~server/log";
import * as Entity from "~shared/model/entities";
import * as Dto from "~shared/model/data-transfer-objects";
import * as Repository from "~shared/model/repositories";

const router = Router();

router.get("/", async (req, res) => {
    const user = req.user;
    if (user.isAdmin) {
        res.render("admin-home", { user });
    } else {
        res.render("error", { error: "heeeey you ain't the admin" });
    }
});

export default router;
