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
    GroupCreateFormValues,
    GroupCreateFormErrors,
    GroupEditFormValues,
    GroupEditFormErrors,
} from "~shared/types";

import { Group, GroupUser, User } from '~server/model/entities';

import { GroupUserApproval, GroupUserPrivilege } from '~shared/enums';

import * as Dto from '~shared/data-transfer-objects';

const router = Router();

async function validateNewGroupHandler(req: Request, res: Response) {
    try {
        const groupRepo = Orm.getCustomRepository(GroupRepository);
        const validationErrors = await groupRepo.validateNewGroup(req.body.data as GroupCreateFormValues);
        res.json(new Api.Response(true, null, validationErrors));
    } catch (err) {
        log.error(err);
        res.status(500);
        res.json(new Api.Response(false, err));
    }
}

router.post('/validateNew', validateNewGroupHandler);

async function validateUpdateGroupHandler(req: Request, res: Response) {
    try {
        const groupRepo = Orm.getCustomRepository(GroupRepository);
        const validationErrors = await groupRepo.validateUpdateGroup(req.body.data);
        res.json(new Api.Response(true, null, validationErrors));
    } catch (err) {
        log.error(`groups/validateNew: ${err.message}`);
        res.status(500);
        res.json(new Api.Response(false, err));
    }
}

router.post('/validateUpdate', validateUpdateGroupHandler);

async function createGroupHandler(req: Request, res: Response) {
    try {
        const params = req.body.data as GroupCreateFormValues;
        const groupRepo = Orm.getCustomRepository(GroupRepository);
        const errors = await groupRepo.validateNewGroup(params);

        if (errors?.name || errors?.customUrl) {
            log.warn(`bad POST to /groups:\nvalues: ${JSON.stringify(params, null, 2)}\nerrors: ${JSON.stringify(errors, null, 2)}`);
            res.status(400);
            return res.json(new Api.Response(false, 'invalid parameters - first check against /groups/validateNew'));
        }

        const group: Group = groupRepo.create({
            name: params.name,
            customUrl: params.customUrl,
        });
        await groupRepo.save(group);

        if (params.addCreatorToGroup) {
            const guRepo = Orm.getCustomRepository(GroupUserRepository);
            const params = {
                privilege: GroupUserPrivilege.admin,
                userApproval: GroupUserApproval.confirmed,
                groupApproval: GroupUserApproval.confirmed,
            };
            const membership: GroupUser = await guRepo.createMembership(
                req.user,
                group,
                params,
            );
            await guRepo.save(membership);
        }

        res.json(new Api.Response(true, null, new Dto.GroupDto(group)));
    } catch (err) {
        log.error(`createGroupHandler: ${err}`);
        res.status(500);
        res.json(new Api.Response(false, 'server error'));
    }
}

router.post('/', requireAuthorization, createGroupHandler);

async function updateGroupHandler(req: Request, res: Response) {
    try {
        const params = req.body.data as GroupEditFormValues;
        const groupRepo = Orm.getCustomRepository(GroupRepository);

        if (!(params?.id ?? false)) {
            res.status(400);
            return res.json(new Api.Response(false, 'id field not found'));
        }

        try {
            await groupRepo.findOneOrFail(params.id);
        } catch (err) {
            res.status(404);
            return res.json(new Api.Response(false, `group not found with id=${params.id}`));
        }

        const errors = await groupRepo.validateUpdateGroup(params);
        if (Object.keys(errors).length > 0) {
            log.warn(`bad PUT to /:groups\nvalues: ${JSON.stringify(params, null, 2)}\nerrors: ${JSON.stringify(errors, null, 2)}`);
            res.status(400)
            return res.json(new Api.Response(false, 'invalid parameters - first check against /groups/validateUpdate'));
        }

        const updateValues = {
            customUrl: params.customUrl,
            description: params.description,
            name: params.name,
            publicJoinable: params.publicJoinable,
            publicVisible: params.publicVisible,
        }

        try {
            await groupRepo.update({ id: params.id }, { ... updateValues });
            res.json(new Api.Response(true, `updated group: ${params.name}`));
        } catch (err) {
            log.warn(`updateGroupHandler groupRepo.update: ${err}`);
            res.status(500);
            res.json(new Api.Response(false, 'server error'));
        }
    } catch (err) {
        log.error(`updateGroupHandler: ${err}`);
        res.status(500);
        res.json(new Api.Response(false, 'server error'));
    }
}

router.put('/', requireAuthorization, updateGroupHandler);

async function findMyGroupsHandler(req: Request, res: Response) {
    try {
        // const groups: Group[] = await Orm.getCustomRepository(GroupRepository).findUserGroups(req.user);
        // const dtos = groups.map(g => new Dto.GroupDto(g));
        // res.json(new Api.Response(true, null, dtos));
        const groups: Group[] = await Orm.getRepository(GroupUser)
            .find({ where: { user: req.user }, relations: ['group'] })
            .then((groupUsers) => groupUsers.map((gu) => gu.group));
        res.json(
            new Api.Response(
                true,
                null,
                groups.map((g) => new Dto.GroupDto(g)),
            ),
        );
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
