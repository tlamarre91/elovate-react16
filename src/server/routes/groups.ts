import { Router, Request, Response, NextFunction } from "express";
import * as Orm from "typeorm";

import { log } from "~shared/log";
import * as Api from "~shared/api";
import * as Repository from "~shared/model/repositories";
import * as Entity from "~shared/model/entities";
import * as Dto from "~shared/model/data-transfer-objects";

const router = Router();
router.get("/:query", async (req, res) => {
    throw new Error("not implemented");
});

router.put("/:query/users-csv", async (req, res) => {
    throw "TODO";
});

export default router;
