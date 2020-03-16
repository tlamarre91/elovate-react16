import * as Orm from "typeorm";

import { BaseRepository } from "./BaseRepository";
import { Group } from "../entities/Group";
import { User } from "../entities/User";
import * as Dto from "../data-transfer-objects";

@Orm.EntityRepository(Group)
export class GroupRepository extends BaseRepository<Group> {
    async findOneFromQuery(query: string): Promise<Group> {
        const id = parseInt(query);
        if (! isNaN(id)) {
            return this.findOne(id);
        } else {
            throw "GroupRepository.findOneFromQuery: query not yet implemented";
        }
    }

    async createFromDto(dto: Dto.GroupDto): Promise<Group> {
        const group = this.create();
        return group;
    }

    async countGroupsWithOwner(user: User): Promise<number> {
        return this.find({ where: { ownerUser: user } })
            .then(res => res.length)
            .catch(err => { throw err });
    }
}

