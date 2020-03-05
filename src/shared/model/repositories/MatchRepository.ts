import * as Orm from "typeorm";

import * as Entity from "../entities";

@Orm.EntityRepository(Entity.Match)
export class MatchRepository extends Orm.Repository<Entity.Match> {
    reportMatch(matchParties: Entity.MatchParty[], result: Entity.MatchResult, datePlayed?: Date): Promise<Entity.Match> {
        const match = this.create();
        match.matchParties = matchParties;
        match.result = result;
        match.datePlayed = datePlayed ? datePlayed: new Date();
        match.changedOn = new Date();
        match.createdOn = new Date();
        return this.save(match);
    }
}
