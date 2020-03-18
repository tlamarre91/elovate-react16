import * as Orm from "typeorm";

import { BaseRepository } from "./BaseRepository";
import { CalendarEvent } from "~shared/model/entities/CalendarEvent";
import { Match, MatchResult } from "~shared/model/entities/Match";
import { Party } from "~shared/model/entities/Party";
import * as Dto from "../data-transfer-objects";

@Orm.EntityRepository(Match)
export class MatchRepository extends BaseRepository<Match> {
    findOneFromQuery(query: string): Promise<Match> {
        throw new Error("Method not implemented.");
    }

    createFromDto(dto: Dto.MatchDto): Promise<Match> {
        throw new Error("Method not implemented.");
    }
}
