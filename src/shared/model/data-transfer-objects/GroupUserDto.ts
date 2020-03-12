import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import * as Entity from "../entities";

export class GroupUserDto extends BaseDto<Entity.GroupUser> {
    userId: number;
    groupId: number;
    privilege: Entity.GroupUserPrivilege;

    constructor(obj: Entity.GroupUser, origin?: string) {
        super(obj, origin);
        this.userId = obj.user.id;
        this.groupId = obj.group.id;
    }
}
