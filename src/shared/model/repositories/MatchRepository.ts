import * as Orm from "typeorm";

import { BaseRepository } from "./BaseRepository";
import * as Entity from "../entities";
import * as Dto from "../data-transfer-objects";

@Orm.EntityRepository(Entity.Match)
export class MatchRepository extends BaseRepository<Entity.Match> {
    findOneFromQuery(query: string): Promise<Entity.Match> {
        throw new Error("Method not implemented.");
    }
    createFromDto(dto: Dto.MatchDto): Promise<Entity.Match> {
        throw new Error("Method not implemented.");
    }
    reportMatch(parties: Entity.Party[], result: Entity.MatchResult, datePlayed?: Date): Promise<Entity.Match> {
        const match = this.create();
        //match.parties = parties;
        match.result = result;
        match.datePlayed = datePlayed ? datePlayed: new Date();
        match.changedOn = new Date();
        match.createdOn = new Date();
        return this.save(match);
    }
}
