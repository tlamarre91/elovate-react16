import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import * as Entity from "../entities";

export class GroupDto extends BaseDto<Entity.Group> {
    constructor(base: Entity.Group, origin?: string) {
        super(base, origin);
    }
}
