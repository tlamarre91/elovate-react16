import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import * as Entity from "../entities";

export class PartyDto extends BaseDto<Entity.Match> {
    constructor(base: Entity.Match, origin?: string) {
        super(base, origin);
    }
}
