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

import { MappedEntity } from "./MappedEntity";
import { User } from "./User";
import { Game } from "./Game";
import { Match } from "./Match";

export enum MatchPartyType {
    adhoc = "adhoc",
    premade = "premade", // "team?" "named?" "season?"
}

@Entity()
export class MatchParty {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(type => User, user => user.matchParties)
    users: User[];

    @ManyToOne(type => Match, match => match.matchParties)
    match: Match;

    @Column()
    partyNumber: number;

    @Column({
        type: "enum",
        enum: MatchPartyType,
        default: MatchPartyType.adhoc
    })
    type: MatchPartyType;
}
