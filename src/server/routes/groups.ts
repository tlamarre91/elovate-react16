import {
    Router, Request, Response, NextFunction,
} from 'express';
import * as Orm from 'typeorm';

import { requireAuthorization } from '~server/middleware/authorization';
import { log } from '~shared/log';
import * as Api from '~shared/api';

import {
    GroupRepository,
    GroupUserRepository,
} from '~server/model/repositories';

import {
    Group,
    GroupUser,
    User,
} from '~server/model/entities';

import {
    GroupUserApproval,
    GroupUserPrivilege,
} from '~shared/enums';

import * as Dto from '~shared/data-transfer-objects';

const router = Router();
router.post('/validateNewGroup', async (req, res) => {
    try {
        const groupRepo = Orm.getCustomRepository(GroupRepository);
        const errors = await groupRepo.validateNewGroup(req.body.data);
        res.json(new Api.Response(true, null, errors));
    } catch (err) {
        res.status(500);
        res.json(new Api.Response(false, err));
    }
});

async function createGroupHandler(req: Request, res: Response) {
    try {
        const params = req.body.data;
        const groupRepo = Orm.getCustomRepository(GroupRepository);
        const errors = await groupRepo.validateNewGroup(params);

        log.info(`errors: ${JSON.stringify(errors)}`);
        if (errors?.name || errors?.customUrl) {
            res.status(400);
            return res.json(new Api.Response(false, 'invalid parameters'));
        }

        const group: Group = groupRepo.create({ name: params.name, customUrl: params.customUrl });
        await groupRepo.save(group);

        if (params.addCreatorToGroup) {
            const guRepo = Orm.getCustomRepository(GroupUserRepository);
            const params = {
                privilege: GroupUserPrivilege.admin,
                userApproval: GroupUserApproval.confirmed,
                groupApproval: GroupUserApproval.confirmed,
            };
            const membership: GroupUser = await guRepo.createMembership(req.user, group, params);
            await guRepo.save(membership);
        }

        res.json(new Api.Response(true, null, new Dto.GroupDto(group)));
    } catch (err) {
        res.status(500);
        log.error(`createGroupHandler: ${err}`);
        res.json(new Api.Response(false, 'server error'));
    }
}

router.post('/', requireAuthorization, createGroupHandler);

async function findMyGroupsHandler(req: Request, res: Response) {
    try {
    // const groups: Group[] = await Orm.getCustomRepository(GroupRepository).findUserGroups(req.user);
    // const dtos = groups.map(g => new Dto.GroupDto(g));
    // res.json(new Api.Response(true, null, dtos));
        const groups: Group[] = await Orm.getRepository(GroupUser)
            .find({ where: { user: req.user }, relations: ['group'] })
            .then((groupUsers) => groupUsers.map((gu) => gu.group));
        res.json(new Api.Response(true, null, groups.map((g) => new Dto.GroupDto(g))));
    } catch (err) {
        log.error(`findMyGroupsHandler: ${err}`);
        res.status(500);
        res.json(new Api.Response(false, 'server error'));
    }
}
router.get('/myGroups', requireAuthorization, findMyGroupsHandler);

async function findGroupByKeyHandler(req: Request, res: Response) {
    try {
        const { key, val } = req.params;
        if (key === 'id') {
            const group = await Orm.getRepository(Group).findOne({
                where: { id: parseInt(val) },
                relations: ['memberships', 'memberships.user'],
            });
            res.json(new Api.Response(true, null, new Dto.GroupDto(group)));
        } else {
            res.status(400);
            res.json(new Api.Response(false, 'can currently only query by ID'));
        }
    } catch (err) {
        log.error(`findGroupByKeyHandler: ${err}`);
        res.status(500);
        res.json(new Api.Response(false, 'server error'));
    }
}
router.get('/:key/:val', requireAuthorization, findGroupByKeyHandler);

export default router;
