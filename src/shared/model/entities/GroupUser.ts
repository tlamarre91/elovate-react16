import * as Orm from "typeorm";
import { User } from "./User";
import { Group } from "./Group";
import { Resource } from "./Resource";

// need granularity... maybe bitmask for each permission type?
// or maybe i don't need granularity. how bout we just build something that works
export enum GroupUserPrivilege {
    admin = "admin",
    user = "user"
}

@Orm.Entity()
export class GroupUser extends Resource {
    @Orm.ManyToOne(() => Group, group => group.memberships)
    group: Group;

    @Orm.ManyToOne(() => User, user => user.groupMemberships)
    user: User;

    @Orm.Column()
    approvedByGroup: boolean;

    @Orm.Column()
    declinedByGroup: boolean;

    @Orm.Column()
    approvedByUser: boolean;

    @Orm.Column()
    declinedByUser: boolean;

    @Orm.Column({
        type: "enum",
        enum: GroupUserPrivilege,
        default: GroupUserPrivilege.user
    })
    privilege: GroupUserPrivilege;
}
