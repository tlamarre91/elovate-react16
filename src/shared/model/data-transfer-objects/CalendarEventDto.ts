import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import * as Entity from "../entities";

export class CalendarEventDto extends BaseDto<Entity.CalendarEvent> {
    dateCreated: Date;
    scheduledStart: Date;
    scheduledEnd: Date
}
