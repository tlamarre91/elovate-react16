import { Router, Request, Response, NextFunction } from "express";
import * as Orm from "typeorm";

import { log } from "~shared/log";
import * as Api from "~shared/api";
import {
    GroupRepository
} from "~server/model/repositories";
import {
    Group
} from "~server/model/entities";
import * as Dto from "~shared/data-transfer-objects";

const router = Router();
router.post("/validateNewGroup", async (req, res) => {
    try {
        const groupRepo = Orm.getCustomRepository(GroupRepository);
        const errors = await groupRepo.validateNewGroup(req.body.data);
        res.json(new Api.Response(true, null, errors));
    } catch (err) {
        res.status(500);
        res.json(new Api.Response(false, err));
    }
});

// TODO: probably make all endpoints like this
// i.e. named functions passed to router.method(...)
async function createGroupEndpoint(req: Request, res: Response) {
    if (! req.user) {
        res.status(403);
        return res.json(new Api.Response(false, "not logged in"));
    }

    try {
        const params = req.body.data;
        const groupRepo = Orm.getCustomRepository(GroupRepository);
        const errors = await groupRepo.validateNewGroup(params);
        if (errors?.name || errors?.customUrl) {
            res.status(400);
            return res.json(new Api.Response(false, "invalid parameters"));
        }

        const group: Group = groupRepo.create({ name: params.name, customUrl: params.customUrl });
        groupRepo.save(group);
        res.json(new Api.Response(true, null, new Dto.GroupDto(group)));
    } catch (err) {
        res.status(500);
        log.error(`createGroupEndpoint: ${err}`);
        res.json(new Api.Response(false, "server error"));
    }
}

router.post("/", createGroupEndpoint);

export default router;
