import * as Orm from "typeorm";

import { CalendarEvent } from "~shared/model/entities/CalendarEvent";

import { BaseRepository } from "./BaseRepository";
import * as Dto from "../data-transfer-objects";
import { BaseDto } from "../BaseDto";

@Orm.EntityRepository(CalendarEvent)
export class CalendarEventRepository extends BaseRepository<CalendarEvent> {
    createFromDto(dto: Dto.CalendarEventDto): Promise<CalendarEvent> {
        throw "not yet implemented";
    }
    
    findOneFromQuery(query: string): Promise<CalendarEvent> {
        throw "not yet implemented";
    }
}
