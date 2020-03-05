import * as Orm from "typeorm";
import * as Entity from ".";
import { Resource } from "../Resource";

@Orm.Entity()
export class User extends Resource {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column({ default: () => "NOW()" })
    dateCreated: Date;

    @Orm.Column({ nullable: true})
    lastLogin: Date;

    @Orm.ManyToOne(() => Entity.ImageAsset)
    avatarAsset: Entity.ImageAsset;

    @Orm.Index({ unique: true })
    @Orm.Column({ length: 64, nullable: true })
    username?: string;

    @Orm.Column({ length: 64 })
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
    isPublic: boolean;

    @Orm.Column({ length: 128, nullable: true })
    passwordDigest?: string;

    @Orm.OneToMany(() => Entity.GroupUser, groupUser => groupUser.user)
    groupMemberships: Entity.GroupUser[];

    @Orm.Column({ type: "int", nullable: true })
    loginExp?: number;

    @Orm.Column({ type: "int", nullable: true })
    invalidateLoginsBefore?: number;

    @Orm.ManyToMany(() => Entity.MatchParty, matchParty => matchParty.users)
    @Orm.JoinTable()
    matchParties: Entity.MatchParty[];

    @Orm.OneToMany(() => Entity.Notification, notification => notification.recipient)
    notifications: Entity.Notification[];
}
