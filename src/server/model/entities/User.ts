import * as Orm from 'typeorm';

import {
    CreationInfo,
    Group,
    GroupUser,
    ImageAsset,
    Notification,
    Owners,
    Team,
} from '.';

@Orm.Entity()
export class User {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column(() => CreationInfo)
    creationInfo: CreationInfo;

    @Orm.Column(() => Owners)
    owners: Owners;

    @Orm.Column({ nullable: true })
    lastLogin?: Date;

    @Orm.ManyToOne(() => ImageAsset, { nullable: true })
    avatarAsset?: ImageAsset;

    @Orm.Index({ unique: true })
    @Orm.Column({ length: 64, nullable: true })
    username?: string;

    // TODO: maybe just make an un-joinable admin group...
    // would that be less flimsy?
    @Orm.Column({ default: false })
    isAdmin: boolean;

    @Orm.Column({ length: 64, nullable: true })
    displayName: string;

    @Orm.Index({ unique: true })
    @Orm.Column({ length: 64, nullable: true })
    email?: string;

    @Orm.Column({ default: false })
    hasAccount: boolean;

    @Orm.Column({ default: false })
    emailVerified: boolean;

    @Orm.Column({ default: false })
    receivesEmail: boolean;

    @Orm.Column({ default: false })
    publicVisible: boolean;

    @Orm.Column({ length: 128, nullable: true })
    passwordDigest?: string;

    /*
     * invalidateLoginsBefore: seconds in unix epoch (standard for JWT)
     */
    @Orm.Column({ type: 'int' })
    invalidateLoginsBefore?: number;

    @Orm.ManyToMany(() => Team, (team) => team.users)
    teams: Team[];

    @Orm.OneToMany(() => Notification, (notification) => notification.recipient)
    notifications: Notification[];

    @Orm.OneToMany(() => GroupUser, (groupUser) => groupUser.user)
    groupMemberships: GroupUser[];
}
