import * as Orm from "typeorm";
import { CalendarEvent } from "./CalendarEvent";
import { Creation } from "./Creation";
import { Group } from "./Group";
import { Owners } from "./Owners";
import { Party } from "./Party";
import { User } from "./User";

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
export class Match {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column(() => Creation)
    creationInfo: Creation;

    @Orm.Column(() => Owners)
    owners: Owners;
    
    @Orm.OneToOne(() => CalendarEvent)
    calendarEvent: CalendarEvent;

    @Orm.Column({
        type: "enum",
        enum: MatchVisibility,
        default: MatchVisibility.Group
    })
    visibility: MatchVisibility;

    @Orm.OneToMany(() => Party, party => party.match, { cascade: true })
    parties: Party[];

    @Orm.Column({ type: "jsonb", nullable: true })
    @Orm.Index()
    result: MatchResult;
}
