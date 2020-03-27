import * as Orm from 'typeorm';
import {
    CreationInfo, Group, Owners, User,
} from '.';

import { GroupUserPrivilege, GroupUserApproval } from '~shared/enums';

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
        enum: GroupUserApproval,
        default: GroupUserApproval.pending,
    })
    userApproval: GroupUserApproval;

    @Orm.Column({
        type: 'enum',
        enum: GroupUserApproval,
        default: GroupUserApproval.pending,
    })
    groupApproval: GroupUserApproval;

    @Orm.Column({
        type: 'enum',
        enum: GroupUserPrivilege,
        default: GroupUserPrivilege.user,
    })
    privilege: GroupUserPrivilege;
}
