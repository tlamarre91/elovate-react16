import * as Orm from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

// need granularity... maybe bitmask for each permission type?
// or maybe i don't need granularity. how bout we just build something that works
export enum GroupUserPrivilege {
    admin = "admin",
    user = "user"
}

@Orm.Entity()
export class GroupUser {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column({ default: () => "NOW()" })
    created: Date;

    @Orm.Column({ default: () => "NOW()" })
    edited: Date;

    @Orm.ManyToOne(() => User, { nullable: true })
    createdBy?: User;

    @Orm.ManyToOne(() => User, { nullable: true })
    ownerUser?: User;

    @Orm.ManyToOne(() => Group, { nullable: true })
    ownerGroup?: Group;
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
