import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import * as Entity from "../entities";

export class PartyDto extends BaseDto<Entity.Party> {
    constructor(obj: Entity.Party, origin?: string) {
        super(obj, origin);
    }
}
