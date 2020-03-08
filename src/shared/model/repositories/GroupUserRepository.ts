import * as Orm from "typeorm";

import { BaseRepository } from "./BaseRepository";
import { GroupUser, Group, User } from "../entities";
import * as Dto from "../data-transfer-objects";

@Orm.EntityRepository(GroupUser)
export class GroupUserRepository extends BaseRepository<GroupUser> {
    findOneFromQuery(query: string): Promise<GroupUser> {
        throw new Error("Method not implemented.");
    }
    
    createFromDto(dto: Dto.GroupUserDto): GroupUser {
        throw new Error("Method not implemented.");
    }

}
