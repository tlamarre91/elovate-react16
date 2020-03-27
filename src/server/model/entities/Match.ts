import * as Orm from 'typeorm';

import {
    CalendarEvent,
    CreationInfo,
    Group,
    MatchParty,
    Owners,
    Team,
    User,
} from '.';

//import { MatchResultType } from '~shared/enums';
import * as Enums from "../../../shared/enums";

export interface SingleWinnerData {
    winnerParty: number;
}

export interface MatchResult {
    resultType: Enums.MatchResultType;
    resultData: object;
}

export enum MatchVisibility {
    Public = 'public',
    Group = 'group',
    Hidden = 'hidden',
}

@Orm.Entity()
export class Match {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column(() => CreationInfo)
    creationInfo: CreationInfo;

    @Orm.Column(() => Owners)
    owners: Owners;

    @Orm.OneToOne(() => CalendarEvent)
    calendarEvent: CalendarEvent;

    @Orm.Column({
        type: 'enum',
        enum: MatchVisibility,
        default: MatchVisibility.Group,
    })
    visibility: MatchVisibility;

    @Orm.OneToMany(() => MatchParty, (party) => party.match, { cascade: true })
    parties: MatchParty[];

    @Orm.Column({ type: 'jsonb', nullable: true })
    @Orm.Index()
    result: MatchResult;
}
