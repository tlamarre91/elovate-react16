import * as Orm from "typeorm";

import { BaseRepository } from "./BaseRepository";
import { Group } from "../entities";
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

    createFromDto(dto: Dto.GroupDto): Group {
        const group = this.create();
        group.permissionPolicy = dto.permissionPolicy;
        return group;
    }
}

