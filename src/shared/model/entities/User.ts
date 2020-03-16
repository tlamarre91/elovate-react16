import * as Orm from "typeorm";
import { Group } from "./Group";
import { GroupUser } from "./GroupUser";
import { ImageAsset } from "./Asset";
import { Notification } from "./Notification";
import { Party } from "./Party";

@Orm.Entity()
export class User {
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
    @Orm.Column({ default: () => "NOW()" })
    dateCreated: Date;

    @Orm.Column({ nullable: true })
    lastLogin?: Date;

    @Orm.ManyToOne(() => ImageAsset, { nullable: true })
    avatarAsset?: ImageAsset;

    @Orm.Index({ unique: true })
    @Orm.Column({ length: 64, nullable: true })
    username?: string;

    // TODO: should probably just make an un-joinable admin group...
    // would that be less flimsy?
    @Orm.Column({ default: false })
    isAdmin: boolean;

    @Orm.Column({ length: 64, nullable: true })
    displayName: string;
    
    @Orm.Index({ unique: true })
    @Orm.Column({ length: 64, nullable: true })
    email?: string;

    @Orm.Column({ default: false })
    emailVerified: boolean;

    @Orm.Column({ default: false })
    hasAccount: boolean;

    @Orm.Column({ default: false })
    receivesEmail: boolean;

    @Orm.Column({ default: false })
    publicVisible: boolean;

    @Orm.Column({ length: 128, nullable: true })
    passwordDigest?: string;

    @Orm.OneToMany(() => GroupUser, groupUser => groupUser.user)
    groupMemberships: GroupUser[];

    // invalidateLoginsBefore: seconds in unix epoch
    @Orm.Column({ type: "int", nullable: true })
    invalidateLoginsBefore?: number;

    @Orm.ManyToMany(() => Party, party => party.users)
    parties: Party[];

    @Orm.OneToMany(() => Notification, notification => notification.recipient)
    notifications: Notification[];
}
