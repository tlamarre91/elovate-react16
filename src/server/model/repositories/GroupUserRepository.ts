import * as Orm from "typeorm";

import { BaseRepository } from "./BaseRepository";
import {
    GroupUser,
    GroupUserPrivilege,
    Group,
    User,
    Creation
} from "~server/model/entities";
import * as Dto from "~shared/data-transfer-objects";

@Orm.EntityRepository(GroupUser)
export class GroupUserRepository extends BaseRepository<GroupUser> {
    createFromDto(dto: Dto.GroupUserDto): Promise<GroupUser> {
        throw new Error("Method not implemented.");
    }

    async createMembership(user: User, group: Group, params?: {
        privilege?: GroupUserPrivilege,
        createdBy?: User
    }): Promise<GroupUser> {
        const gu = this.create();
        gu.user = user;
        gu.group = group;
        gu.privilege = params?.privilege ?? GroupUserPrivilege.user;
        //gu.creationInfo.createdBy = params?.createdBy ?? user;
        gu.creationInfo = new Creation();
        gu.creationInfo.createdBy = params?.createdBy ?? user;
        return gu;
    }

    async findGroupMembership(user: User, group: Group): Promise<GroupUser> {
        throw new Error("not yet implemented");
    }
}
