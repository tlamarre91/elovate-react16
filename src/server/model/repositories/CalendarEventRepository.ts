import * as Orm from 'typeorm';

import { CalendarEvent } from '~server/model/entities';

import { BaseRepository } from './BaseRepository';
import * as Dto from '~shared/data-transfer-objects';

@Orm.EntityRepository(CalendarEvent)
export class CalendarEventRepository extends BaseRepository<CalendarEvent> {
    createFromDto(dto: Dto.CalendarEventDto): Promise<CalendarEvent> {
        throw 'not yet implemented';
    }
}
