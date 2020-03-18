import * as Orm from "typeorm";

import { BaseRepository } from "./BaseRepository";
import { GroupUser, GroupUserPrivilege } from "../entities/GroupUser";
import { Group } from "../entities/Group";
import { User } from "../entities/User";
import * as Dto from "../data-transfer-objects";

@Orm.EntityRepository(GroupUser)
export class GroupUserRepository extends BaseRepository<GroupUser> {
    findOneFromQuery(query: string): Promise<GroupUser> {
        throw new Error("Method not implemented.");
    }
    
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
        gu.creationInfo.createdBy = params?.createdBy ?? user;
        return gu;
    }

    async findGroupMembership(user: User, group: Group): Promise<GroupUser> {
        throw new Error("not yet implemented");
    }
}
