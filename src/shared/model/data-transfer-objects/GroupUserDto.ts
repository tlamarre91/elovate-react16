import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import * as Entity from "../entities";

export class GroupUserDto extends BaseDto<Entity.GroupUser> {
    constructor(obj: Entity.GroupUser, origin?: string) {
        super(obj, origin);
    }
}
