import * as Orm from 'typeorm';
import {
    CreationInfo, Group, Owners, User, 
} from '.';

import * as Enums from "../../../shared/enums";

//import { GroupUserPrivilege, GroupUserApproval } from '~shared/enums';

@Orm.Entity()
export class GroupUser {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column(() => CreationInfo)
    creationInfo: CreationInfo;

    @Orm.Column(() => Owners)
    owners: Owners;

    @Orm.ManyToOne(() => Group, (group) => group.memberships)
    group: Group;

    @Orm.ManyToOne(() => User, (user) => user.groupMemberships)
    user: User;

    @Orm.Column({
        type: 'enum',
        enum: Enums.GroupUserApproval,
        default: Enums.GroupUserApproval.pending,
    })
    userApproval: Enums.GroupUserApproval;

    @Orm.Column({
        type: 'enum',
        enum: Enums.GroupUserApproval,
        default: Enums.GroupUserApproval.pending,
    })
    groupApproval: Enums.GroupUserApproval;

    @Orm.Column({
        type: 'enum',
        enum: Enums.GroupUserPrivilege,
        default: Enums.GroupUserPrivilege.user,
    })
    privilege: Enums.GroupUserPrivilege;
}
