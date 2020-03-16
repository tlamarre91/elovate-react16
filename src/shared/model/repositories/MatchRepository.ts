import * as Orm from "typeorm";

import { BaseRepository } from "./BaseRepository";
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
    reportMatch(parties: Party[], result: MatchResult, datePlayed?: Date): Promise<Match> {
        const match = this.create();
        //match.parties = parties;
        match.result = result;
        match.datePlayed = datePlayed ? datePlayed: new Date();
        match.changedOn = new Date();
        match.createdOn = new Date();
        return this.save(match);
    }
}
