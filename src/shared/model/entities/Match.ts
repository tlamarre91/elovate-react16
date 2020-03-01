import winston from "winston";
import * as Orm from "typeorm";

import { User, Game, MatchParty } from ".";

export enum MatchResultType {
    singleWinner = "s"
}

class MatchResultData {
    constructor() {
        return "FUCK I DON'T KNOW WHAT I'M DOING";
    }
}

export interface MatchResult {
    version: number;
    ranked: boolean;
    type: MatchResultType;
    data: MatchResultData;
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

@Orm.Entity()
export class Match {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.ManyToOne(type => Game, game => game.matches)
    game: Game;

    @Orm.Column({ default: () => "NOW()" })
    changedOn: Date;
    
    @Orm.Column({ default: () => "NOW()" })
    createdOn: Date;

    @Orm.Column({ nullable: true })
    @Orm.Index()
    datePlayed: Date;

    @Orm.Column({
        type: "enum",
        enum: MatchVisibility,
        default: MatchVisibility.Group
    })
    visibility: MatchVisibility;

    @Orm.OneToMany(type => MatchParty, matchParty => matchParty.match, { cascade: true })
    @Orm.JoinTable()
    matchParties: MatchParty[];

    @Orm.Column({ type: "jsonb", nullable: true })
    @Orm.Index()
    result: MatchResult;
}
