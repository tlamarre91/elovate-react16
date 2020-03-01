import * as Orm from "typeorm";

import { Match, MatchResult, MatchResultType, MatchParty } from "../entities";

@Orm.EntityRepository(Match)
export class MatchRepository extends Orm.Repository<Match> {
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
