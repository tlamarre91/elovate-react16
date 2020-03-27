import * as Orm from 'typeorm';

import {
    blacklists,
    regex
} from '~shared/util';

import { BaseRepository, GroupUserRepository } from '.';

import { Group, User, GroupUser } from '~server/model/entities';

import { GroupUserApproval } from '~shared/enums';

import { GroupCreateFormValues, GroupCreateFormErrors, GroupEditFormValues, GroupEditFormErrors } from "~shared/types";

import * as Dto from '~shared/data-transfer-objects';

@Orm.EntityRepository(Group)
export class GroupRepository extends BaseRepository<Group> {
    async validateNewGroup(values: GroupCreateFormValues): Promise<GroupCreateFormErrors> {
        const errors: GroupCreateFormErrors = {};
        if (!(values?.name ?? false) || values.name.length === 0) {
            errors.name = 'Provide a group name';
        } else if (
            await this.count({
                where: { name: values.name }
            }).then((count) => count > 0)
        ) {
            errors.name = `Group name ${values.name} already in use`;
        }

        // TODO: actually customUrl will be... still don't know what i'll call it
        // but it will have the same rules at twitter's @
        if (!(values?.customUrl ?? false) || values.customUrl.length === 0) {
            errors.customUrl = 'Provide a custom URL';
        } else if (! values.customUrl.match(regex.alphanumericDashUnderscore128)) {
            errors.customUrl = 'Custom URL may only contain alphanumeric characters, dashes, and underscores';
        } else if (
            await this.count({
                where: { customUrl: values.customUrl },
            }).then((count) => count > 0)
        ) {
            errors.customUrl = `Custom URL ${values.customUrl} already in use`;
        }

        return errors;
    }

    async validateUpdateGroup(values: GroupEditFormValues): Promise<GroupEditFormErrors> {
        const errors: GroupEditFormErrors = {};
        if (!(values?.name ?? false)) {
            throw new Error('name field not set');
        } else if (values.name.length < 1) {
            errors.name = 'Provide a group name';
        } else if (
            await this.count({
                where: { name: values.name, id: Orm.Not(values.id) }
            }).then((count) => count > 0)
        ) {
            errors.name = `Group name ${values.name} already in use by another group`;
        }

        if (!(values?.description ?? false)) {
            throw new Error('description field not set');
        } else if (values.description.length > 512) {
            errors.description = 'Description is too long (character limit: 512)';
        }

        if (!(values?.customUrl ?? false)) {
            throw new Error('customUrl field not set');
        } else if (values.customUrl.length < 1) {
            errors.customUrl = 'Provide a custom URL';
        } else if (! values.customUrl.match(regex.alphanumericDashUnderscore128)) {
            errors.customUrl = 'Custom URL may only contain alphanumeric characters, dashes, and underscores';
        } else if (
            await this.count({
                where: { customUrl: values.customUrl, id: Orm.Not(values.id) }
            }).then((count) => count > 0)
        ) {
            errors.customUrl = `Custom URL ${values.customUrl} already in use by another group`;
        }

        return errors;
    }

    async findGroupsVisibleToUser(user: User) {
        throw new Error('not yet implemented');
    }

    async findUserGroups(user: User): Promise<Group[]> {
        const groupUserRepo = Orm.getRepository(GroupUser);
        const memberships: GroupUser[] = await groupUserRepo.find({
            where: {
                user,
                userApproval: GroupUserApproval.confirmed,
                groupApproval: GroupUserApproval.confirmed,
            },
            relations: ['group'],
        });
        return memberships.map((m) => m.group);
    }

    async createFromDto(dto: Dto.GroupDto): Promise<Group> {
        throw new Error('not yet implemented');
    }

    async countGroupsWithOwner(user: User): Promise<number> {
        return this.find({ where: { ownerUser: user } })
            .then((res) => res.length)
            .catch((err) => {
                throw err;
            });
    }
}
