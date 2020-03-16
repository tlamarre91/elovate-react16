import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import { CalendarEvent } from "../entities/CalendarEvent";

export class CalendarEventDto extends BaseDto<CalendarEvent> {
    dateCreated: Date;
    scheduledStart: Date;
    scheduledEnd: Date
}
