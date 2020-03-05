import * as Orm from "typeorm";
import { Party } from "./Party";
import { Resource } from "../Resource";

export enum MatchResultType {
    singleWinner = "s"
}

export class MatchResultData {
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
export class Match extends Resource {
//    @Orm.ManyToOne(() => Entity.Game, game => game.matches)
//    game: Entity.Game;

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

    //@Orm.OneToMany(() => Party, party => party.match, { cascade: true })
    //parties: Party[];

    @Orm.Column({ type: "jsonb", nullable: true })
    @Orm.Index()
    result: MatchResult;
}
