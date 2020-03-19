import * as Dto from ".";
import { BaseDto } from "./BaseDto";
import { Match } from "~server/model/entities/Match";

export class MatchDto extends BaseDto<Match> {
    calendarEventId: number;
    constructor(obj: Match, origin?: string) {
        super(obj, origin);
    }
}
