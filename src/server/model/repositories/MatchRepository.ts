import * as Orm from "typeorm";

import { BaseRepository } from "./BaseRepository";
import {
    CalendarEvent,
    Match,
    MatchResult,
    Party
} from "~server/model/entities";
import * as Dto from "~shared/data-transfer-objects";

@Orm.EntityRepository(Match)
export class MatchRepository extends BaseRepository<Match> {
    findOneFromQuery(query: string): Promise<Match> {
        throw new Error("Method not implemented.");
    }

    createFromDto(dto: Dto.MatchDto): Promise<Match> {
        throw new Error("Method not implemented.");
    }
}
