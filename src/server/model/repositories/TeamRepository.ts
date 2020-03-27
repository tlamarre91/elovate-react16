import * as Orm from 'typeorm';

import { BaseRepository } from './BaseRepository';
import { Match, User, Team } from '~server/model/entities';

import { TeamType } from '~shared/enums';

import * as Dto from '~shared/data-transfer-objects';

@Orm.EntityRepository(Team)
export class TeamRepository extends BaseRepository<Team> {
    createFromDto(dto: Dto.TeamDto): Promise<Team> {
        throw new Error('Method not implemented.');
    }
}
