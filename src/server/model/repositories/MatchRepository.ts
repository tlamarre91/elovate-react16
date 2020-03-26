import * as Orm from 'typeorm';

import { BaseRepository } from '.';
import {
    CalendarEvent,
    Match,
    MatchResult,
    Team,
} from '~server/model/entities';
import * as Dto from '~shared/data-transfer-objects';

@Orm.EntityRepository(Match)
export class MatchRepository extends BaseRepository<Match> {
    createFromDto(dto: Dto.MatchDto): Promise<Match> {
        throw new Error('Method not implemented.');
    }
}
