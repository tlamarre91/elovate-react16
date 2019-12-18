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

import { MappedEntity } from "./MappedEntity";
import { User } from "./User";
import { Game } from "./Game";
import { MatchParty } from "./MatchParty";

export enum MatchResultType {
    singleWinner = "singleWinner"
}

export interface MatchResult {
    version: number;
    ranked: boolean;
    type: MatchResultType;
}

export interface PendingResult extends MatchResult {
    scheduled: Date;
}

export interface SingleWinnerResult extends MatchResult {
    winner: number;
}

export enum MatchVisibility {
    Public = "public",
    Group = "group",
    Hidden = "hidden"
}

@Entity()
export class Match extends MappedEntity<Api.MatchProps> {
    toProps() {
        return { ... this };
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Game, game => game.matches)
    game: Game;

    //@Column({ default: () => "NOW()" })
    @Column()
    changedOn: Date;
    
    //@Column({ default: () => "NOW()" })
    @Column()
    createdOn: Date;

    @Column()
    @Index()
    datePlayed: Date;

    @Column({
        type: "enum",
        enum: MatchVisibility,
        default: MatchVisibility.Group
    })
    visibility: MatchVisibility;

    @OneToMany(type => MatchParty, matchParty => matchParty.match, { cascade: true })
    @JoinTable()
    matchParties: MatchParty[];

    @Column({ type: "jsonb", nullable: true })
    @Index()
    result: MatchResult;
}

@EntityRepository(Match)
export class MatchRepository extends Repository<Match> {
    reportMatch(matchParties: MatchParty[], result: MatchResult, datePlayed?: Date): Promise<Match> {
        const match = this.create();
        match.matchParties = matchParties;
        match.result = result;
        match.datePlayed = datePlayed ? datePlayed: new Date();
        match.changedOn = new Date();
        match.createdOn = new Date();
        return this.save(match);
    }
}
