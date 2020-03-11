import { Router } from "express";
import * as Orm from "typeorm";

import * as Api from "~shared/api";
import { log } from "~server/log";
import * as Dto from "~shared/model/data-transfer-objects";

const USER_PROFILE_TEMPLATE = "user-profile";

const router = Router();

router.get("/:query", async (req, res) => {
    // TODO: validate query
//    const repo = Orm.getRepository(Entity.User);
//    const query = req.params["query"];

});

export default router;
