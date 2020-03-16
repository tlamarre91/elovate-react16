import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import { Match } from "../entities/Match";

export class MatchDto extends BaseDto<Match> {
    constructor(obj: Match, origin?: string) {
        super(obj, origin);
    }
}
