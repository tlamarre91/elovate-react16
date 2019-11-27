import {
    getRepository,
    Repository,
    EntityRepository,
    Entity,
    Column,
    Index,
    JoinTable,
    PrimaryGeneratedColumn,
    OneToOne,
    ManyToOne,
    OneToMany,
    ManyToMany
} from "typeorm";

import * as Api from "../../api";

import { User } from "./User";
import { Game } from "./Game";
import { Match } from "./Match";

@Entity()
export class MatchParty {
    @ManyToMany(type => User, user => user.matchParties, {
        cascade: true
    })
    users: User[];

    @ManyToOne(type => Match, match => match.matchParties, {
        cascade: true
    })
    match: Match;

    partyNumber: number;
}
