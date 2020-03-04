import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import * as Entity from "../entities";

export class LeagueDto extends BaseDto<Entity.League> {
    constructor(base: Entity.League, origin?: string) {
        super(base, origin);
    }
}
