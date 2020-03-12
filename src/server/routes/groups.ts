import { Router, Request, Response, NextFunction } from "express";
import * as Orm from "typeorm";

import { log } from "~shared/log";
import * as Api from "~shared/api";
import * as Repository from "~shared/model/repositories";
import * as Entity from "~shared/model/entities";
import * as Dto from "~shared/model/data-transfer-objects";

async function groupQueryMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
        const query = req.params["query"];
        const group = await Orm.getCustomRepository(Repository.GroupRepository).findOneFromQuery(query);

        if (! group) {
            res.status(404);
            return res.json(new Api.Response(false, `group not found: ${query}`));
        }

        if (group.publicVisible) {
            req.resource = group;
            return next();
        }

        const membership: Entity.GroupUser = req.user.groupMemberships
            .filter((gu: Entity.GroupUser) => gu.group.id === group.id)?.[0];

        if (! membership) {
            // TODO: don't expose private group to unauthorized user at all
            res.status(403);
            return res.json(new Api.Response(false, `user ${req.user} not authorized to view group ${group.id}`))
        } else {
            req.resource = group;
            return next();
        }
    } catch (err) {
        log.error(`groupQueryMiddleware: ${err}`);
        res.status(500);
        res.json(new Api.Response(false, err));
    }
}

const router = Router();
router.get("/:query", groupQueryMiddleware, async (req, res) => {
    res.json(new Api.Response(true, null, new Dto.GroupDto(req.resource as Entity.Group)));
});

router.put("/:query/users-csv", groupQueryMiddleware, async (req, res) => {
    throw "TODO";
});

export default router;
