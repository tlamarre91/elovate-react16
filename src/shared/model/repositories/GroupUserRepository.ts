import * as Orm from "typeorm";

import { GroupUser, Group, User } from "../entities";

@Orm.EntityRepository(GroupUser)
export class GroupUserRepository extends Orm.Repository<GroupUser> {
}
