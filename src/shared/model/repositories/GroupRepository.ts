import * as Orm from "typeorm";
import { Group } from "../entities";

@Orm.EntityRepository(Group)
export class GroupRepository extends Orm.Repository<Group> {
}

