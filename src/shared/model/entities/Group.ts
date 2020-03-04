import * as Orm from "typeorm";
import * as Entity from ".";
import { Resource } from "../Resource";

@Orm.Entity()
export class Group extends Resource {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column()
    name: string;

    @Orm.Column({ default: () => "NOW()" })
    dateCreated: Date;

    @Orm.OneToMany(() => Entity.GroupUser, groupUser => groupUser.group)
    @Orm.JoinTable()
    users: Entity.GroupUser[];

    @Orm.OneToMany(() => Entity.MatchParty, matchParty => matchParty.group)
    @Orm.JoinTable()
    matchParties: Entity.MatchParty[];
}
