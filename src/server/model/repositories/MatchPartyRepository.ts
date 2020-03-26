import * as Orm from "typeorm";

import { BaseRepository } from ".";
import {
    CalendarEvent,
    Match,
    MatchParty,
    MatchResult,
    Team,
} from "~server/model/entities";
import * as Dto from "~shared/data-transfer-objects";

@Orm.EntityRepository(MatchParty)
export class MatchPartyRepository extends BaseRepository<MatchParty> {
    createFromDto(dto: Dto.MatchDto): Promise<MatchParty> {
        throw new Error("Method not implemented.");
    }
}

