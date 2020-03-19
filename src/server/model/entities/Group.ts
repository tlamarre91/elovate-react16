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
    @Orm.Index({ unique: true })
    @Orm.Column({ length: 64, nullable: true })
    customUrl: string;

    @Orm.Column({ default: () => "NOW()" })
    dateCreated: Date;

    @Orm.Column({ default: false })
    publicVisible: boolean;

    @Orm.Column({ default: false })
    publicJoinable: boolean;

    @Orm.OneToMany(() => GroupUser, groupUser => groupUser.group)
    memberships: GroupUser[];

    @Orm.OneToMany(() => Party, party => party.group)
    parties: Party[];
}
