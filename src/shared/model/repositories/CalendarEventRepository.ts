import * as Orm from "typeorm";

import { BaseRepository } from "./BaseRepository";
import * as Entity from "../entities";
import * as Dto from "../data-transfer-objects";
import { BaseDto } from "../BaseDto";

@Orm.EntityRepository(Entity.CalendarEvent)
export class CalendarEventRepository extends BaseRepository<Entity.CalendarEvent> {
    createFromDto(dto: Dto.CalendarEventDto): Entity.CalendarEvent {
        throw "not yet implemented";
    }
    
    findOneFromQuery(query: string): Promise<Entity.CalendarEvent> {
        throw "not yet implemented";
    }
}
