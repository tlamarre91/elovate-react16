import { Router, Request, Response } from "express";
import * as Orm from "typeorm";

import * as Api from "~shared/api";
import { log } from "~server/log";
import * as Entity from "~shared/model/entities";
import * as Dto from "~shared/model/data-transfer-objects";
import * as Repository from "~shared/model/repositories";

const GROUP_PROFILE_TEMPLATE = "group-profile";

const router = Router();

router.get("/:query", async (req, res) => {
    try {
        log.info(`autoquery got group ${ req.resource.id }`);
    } catch (err) {
        log.warn(`group-router: ${err}`);
    }
    try {
        const query = req.params["query"];
        const group = await Orm.getCustomRepository(Repository.GroupRepository)
            .findOneFromQuery(query);
        if (group) {
            res.render(GROUP_PROFILE_TEMPLATE, { group });
        } else {
            res.status(404);
            res.render(GROUP_PROFILE_TEMPLATE, { error: `group not found: ${query}` });
        }
    } catch (error) {
        log.warn(`groups/:query router: ${error}`);
        res.render("group-profile", { error });
    }
});

// router.get("/:query/dashboard", async (req, res) => {
//     try {
//         const query = req.params["query"];
//         const group = Orm.getCustomRepository(Repository.GroupRepository);
//             .findOneFromQuery(query);
// }

export default router;
