import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import * as Entity from "../entities";

export class PartyDto extends BaseDto<Entity.Match> {
    constructor(obj: Entity.Match, origin?: string) {
        super(obj, origin);
    }
}
