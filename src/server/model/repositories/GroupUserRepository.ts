import * as Orm from 'typeorm';

import { BaseRepository } from './BaseRepository';

import {
    GroupUser,
    Group,
    User,
    CreationInfo,
} from '~server/model/entities';

import {
    GroupUserApproval,
    GroupUserPrivilege,
} from '~shared/enums';

import * as Dto from '~shared/data-transfer-objects';

@Orm.EntityRepository(GroupUser)
export class GroupUserRepository extends BaseRepository<GroupUser> {
    createFromDto(dto: Dto.GroupUserDto): Promise<GroupUser> {
        throw new Error('Method not implemented.');
    }

    async createMembership(user: User, group: Group, params?: {
        createdBy?: User,
        groupApproval: GroupUserApproval,
        privilege?: GroupUserPrivilege,
        userApproval: GroupUserApproval,
    }): Promise<GroupUser> {
        const gu = this.create();
        gu.user = user;
        gu.group = group;
        gu.privilege = params?.privilege ?? GroupUserPrivilege.user;
        gu.groupApproval = params?.groupApproval ?? GroupUserApproval.pending;
        gu.userApproval = params?.userApproval ?? GroupUserApproval.pending;
        gu.creationInfo = new CreationInfo();
        gu.creationInfo.createdBy = params?.createdBy ?? user;
        return gu;
    }

    async findGroupMembership(user: User, group: Group): Promise<GroupUser> {
        throw new Error('not yet implemented');
    }
}
