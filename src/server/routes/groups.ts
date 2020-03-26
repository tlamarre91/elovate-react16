import { Router, Request, Response, NextFunction } from "express";
import * as Orm from "typeorm";

import { requireAuthorization } from "~server/middleware/authorization";
import { log } from "~shared/log";
import * as Api from "~shared/api";
import {
    GroupRepository,
    GroupUserRepository
} from "~server/model/repositories";
import {
    Group,
    GroupUser,
    GroupUserPrivilege,
    User
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
async function createGroupHandler(req: Request, res: Response) {
    try {
        const params = req.body.data;
        const groupRepo = Orm.getCustomRepository(GroupRepository);
        const errors = await groupRepo.validateNewGroup(params);

        log.info(`errors: ${JSON.stringify(errors)}`);
        if (errors?.name || errors?.customUrl) {
            res.status(400);
            return res.json(new Api.Response(false, "invalid parameters"));
        }

        const group: Group = groupRepo.create({ name: params.name, customUrl: params.customUrl });
        await groupRepo.save(group);

        if (params.addCreatorToGroup) {
            const guRepo = Orm.getCustomRepository(GroupUserRepository);
            const membership: GroupUser = await guRepo.createMembership(req.user, group, { privilege: GroupUserPrivilege.admin });
            await guRepo.save(membership);
        }

        res.json(new Api.Response(true, null, new Dto.GroupDto(group)));
    } catch (err) {
        res.status(500);
        log.error(`createGroupHandler: ${err}`);
        res.json(new Api.Response(false, "server error"));
    }
}

router.post("/", requireAuthorization, createGroupHandler);

async function findUserGroupsHandler(req: Request, res: Response) {
    try {
        const groups: Group[] = await Orm.getCustomRepository(GroupRepository).findUserGroups(req.user);
        const dtos = groups.map(g => new Dto.GroupDto(g));
        res.json(new Api.Response(true, null, dtos));
    } catch (err) {
        log.error(`findUserGroupsHandler: ${err}`);
        res.status(500);
        res.json(new Api.Response(false, "server error"));
    }
}
router.get("/myGroups", requireAuthorization, findUserGroupsHandler);

async function findGroupByIdHandler(req: Request, res: Response) {
    try {
        const group = await Orm.getRepository(Group).findOne(req.params["id"]);
        res.json(new Api.Response(true, null, new Dto.GroupDto(group)));
    } catch (err) {
        log.error(`findGroupByIdHandler: ${err}`);
        res.status(500);
        res.json(new Api.Response(false, "server error"));
    }
}
router.get("/id/:id", requireAuthorization, findGroupByIdHandler);

export default router;
