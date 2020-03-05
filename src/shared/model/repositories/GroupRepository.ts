import * as Orm from "typeorm";
import { Group } from "../entities";

@Orm.EntityRepository(Group)
export class GroupRepository extends Orm.Repository<Group> {
    async findOneFromQuery(query: string): Promise<Group> {
        const id = parseInt(query);
        if (! isNaN(id)) {
            return this.findOne(id);
        } else {
            throw "GroupRepository.findOneFromQuery: query not yet implemented";
        }
    }
}

