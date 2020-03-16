import * as Orm from "typeorm";
import { GroupUser } from "./GroupUser";
import { Party } from "./Party";
import { User } from "./User";

@Orm.Entity()
export class Group {
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
