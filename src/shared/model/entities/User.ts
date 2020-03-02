import * as Orm from "typeorm";
import { log } from "~server/log";


import { Group, Match, MatchParty, ImageAsset } from ".";

@Orm.Entity()
export class User {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column({ default: () => "NOW()" })
    dateCreated: Date;

    @Orm.ManyToOne(type => ImageAsset)
    avatarAsset: ImageAsset;

    @Orm.Index({ unique: true })
    @Orm.Column({ length: 64, nullable: true })
    username: string;

    @Orm.Column({ length: 64 })
    displayName: string;
    
    @Orm.Index({ unique: true })
    @Orm.Column({ length: 64, nullable: true })
    email: string;

    @Orm.Column({ default: false })
    emailVerified: boolean;

    @Orm.Column({ default: false })
    hasAccount: boolean;

    @Orm.Column({ default: false })
    receivesEmail: boolean;

    @Orm.Column({ default: false })
    isPublic: boolean;

    @Orm.Column({ length: 128, nullable: true })
    passwordDigest: string;

    @Orm.ManyToMany(type => Group, group => group.members)
    groups: Group[];

//    @Orm.OneToMany(type => Session, session => session.user)
//    loginSessions: Promise<Session[]>;

    @Orm.ManyToMany(type => MatchParty, matchParty => matchParty.users, { cascade: true })
    @Orm.JoinTable()
    matchParties: MatchParty[];
}
