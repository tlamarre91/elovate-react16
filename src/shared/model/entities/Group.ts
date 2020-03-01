import winston from "winston";
import * as Orm from "typeorm";

import { User, MatchParty } from ".";

@Orm.Entity()
export class Group {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column()
    name: string;

    @Orm.Column({ default: () => "NOW()" })
    dateCreated: Date;

    @Orm.ManyToMany(type => User, user => user.groups)
    @Orm.JoinTable()
    members: User[];

    @Orm.OneToMany(type => MatchParty, matchParty => matchParty.group)
    @Orm.JoinTable()
    matchParties: MatchParty[];
}
