import * as Orm from "typeorm";

import { Group, User } from ".";

@Orm.Entity()
export class GroupUser {
    @Orm.PrimaryGeneratedColumn()
    id: number;
}
