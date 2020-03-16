import * as Orm from "typeorm";
import { Resource } from "./Resource";
import { GroupUser } from "./GroupUser";
import { Party } from "./Party";

@Orm.Entity()
export class Group extends Resource {
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
