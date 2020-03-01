import * as Orm from "typeorm";

import { User, Game, Group, Match } from ".";

export enum MatchPartyType {
    adhoc = "a",
    premade = "p"
}

@Orm.Entity()
export class MatchParty {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.ManyToMany(type => User, user => user.matchParties)
    users: User[];

    @Orm.ManyToOne(type => Match, match => match.matchParties)
    match: Match;

    @Orm.Column()
    partyNumber: number;

    @Orm.Column({
        type: "enum",
        enum: MatchPartyType,
        default: MatchPartyType.adhoc
    })
    partyType: MatchPartyType;

    @Orm.ManyToOne(type => Group, group => group.matchParties)
    group: Group;
}
