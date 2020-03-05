import * as Orm from "typeorm";
import { Resource } from "../Resource";
import { GroupUser } from "./GroupUser";
import { Party } from "./Party";

@Orm.Entity()
export class Group extends Resource {
    @Orm.Column()
    name: string;

    // TODO: validate alphanumeric with dashes/underscore/whatever
    @Orm.Column({ length: 64, nullable: true })
    customUrlName: string;

    @Orm.Column({ default: () => "NOW()" })
    dateCreated: Date;

    @Orm.OneToMany(() => GroupUser, groupUser => groupUser.group)
    users: GroupUser[];

    @Orm.OneToMany(() => Party, party => party.group)
    parties: Party[];
}
