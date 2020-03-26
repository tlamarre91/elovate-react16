import * as Orm from 'typeorm';

import {
    BaseRepository,
    GroupUserRepository,
} from '.';

import {
    Group,
    User,
    GroupUser,
} from '~server/model/entities';

import {
    GroupUserApproval,
} from '~shared/enums';

import * as Dto from '~shared/data-transfer-objects';

type NewGroupParams = {
    name?: string;
    customUrl?: string;
}

@Orm.EntityRepository(Group)
export class GroupRepository extends BaseRepository<Group> {
    async validateNewGroup(params: NewGroupParams): Promise<NewGroupParams> {
        const errors: NewGroupParams = {};
        if (params?.name?.length > -1) {
            if (params.name.length === 0) {
                errors.name = 'Provide a group name';
            } else if (await this.count({ where: { name: params.name } }).then((count) => count > 0)) {
                errors.name = `Group name ${params.name} already in use`;
            }
        }

        // TODO: actually customURL will be optional
        if (params?.customUrl?.length > -1) {
            if (params.customUrl.length === 0) {
                errors.customUrl = 'Provide a custom URL';
            } else if (await this.count({ where: { customUrl: params.customUrl } }).then((count) => count > 0)) {
                errors.customUrl = `Custom URL ${params.customUrl} already in use`;
            }
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
            .catch((err) => { throw err; });
    }
}
