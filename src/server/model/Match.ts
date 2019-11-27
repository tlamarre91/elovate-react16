import winston from "winston";

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
import { MatchParty } from "./MatchParty";

export enum MatchVisibility {
    Public = "public",
    Group = "group",
    Hidden = "hidden"
}

@Entity()
export class Match implements Api.MapsTo<Api.MatchProps> {
    toProps() {
        return { ... this };
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Game, game => game.matches)
    game: Game;

    @Column({ default: () => "NOW()" })
    changedOn: Date;
    
    @Column({ default: () => "NOW()" })
    createdOn: Date;

    @Column()
    datePlayed: Date;

    @Column({
        type: "enum",
        enum: MatchVisibility,
        default: MatchVisibility.Group
    })
    visibility: MatchVisibility;

    @OneToMany(type => MatchParty, matchParty => matchParty.match, {
        cascade: true
    })
    matchParties: MatchParty[];
}

@EntityRepository(Match)
export class MatchRepository extends Repository<Match> {
    reportMatch(matchParties: MatchParty[], winner: number, datePlayed?: Date): Promise<Match> {
        const match = this.create();
        match.players = players;
        match.winner = winner;
        match.datePlayed = datePlayed ? datePlayed: new Date();
        match.changedOn = new Date();
        match.createdOn = new Date();
    }
}
