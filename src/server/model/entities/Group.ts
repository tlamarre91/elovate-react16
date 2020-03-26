import * as Orm from "typeorm";

import {
    Creation,
    GroupUser,
    Owners,
    Party,
    User
} from ".";

@Orm.Entity()
export class Group {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column(() => Creation)
    creationInfo: Creation

    @Orm.Column(() => Owners)
    owners: Owners;

    @Orm.Column()
    name: string;

    // TODO: validate alphanumeric with dashes/underscore/whatever
    // TODO: validation should force at least one non-numeric
    // TODO: MAYBE instead of customUrl it should be an @ tag
    @Orm.Index({ unique: true })
    @Orm.Column({ length: 64, nullable: true })
    customUrl: string;

    @Orm.Column({ length: 512, nullable: true })
    description: string;

    @Orm.Column({ default: true })
    publicVisible: boolean;

    @Orm.Column({ default: false })
    publicJoinable: boolean;

    //@Orm.Column({ default: true })
    //publicCanRequestJoin: boolean;

    @Orm.OneToMany(() => GroupUser, groupUser => groupUser.group)
    memberships: GroupUser[];

    @Orm.OneToMany(() => Party, party => party.group)
    parties: Party[];
}
