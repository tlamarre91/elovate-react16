import * as Orm from "typeorm";
import * as Entity from ".";
import { Resource } from "../Resource";

// need granularity... maybe bitmask for each permission type?
// or maybe i don't need granularity. how bout we just build something that works
export enum GroupUserPrivilege {
    admin = "admin",
    user = "user"
}

@Orm.Entity()
export class GroupUser extends Resource {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.ManyToOne(() => Entity.Group, group => group.users)
    group: Entity.Group;

    @Orm.ManyToOne(() => Entity.User, user => user.groupMemberships)
    user: Entity.User;

    @Orm.Column({
        type: "enum",
        enum: GroupUserPrivilege,
        default: GroupUserPrivilege.user
    })
    privilege: GroupUserPrivilege;
}
