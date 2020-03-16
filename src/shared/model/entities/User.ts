import * as Orm from "typeorm";
import { ImageAsset } from "./Asset";
import { GroupUser } from "./GroupUser";
import { Party } from "./Party";
import { Notification } from "./Notification";
import { Resource } from "./Resource";

@Orm.Entity()
export class User extends Resource {
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
