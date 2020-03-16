import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import { GroupUser, GroupUserPrivilege } from "../entities/GroupUser";

export class GroupUserDto extends BaseDto<GroupUser> {
    userId: number;
    groupId: number;
    privilege: GroupUserPrivilege;

    constructor(obj: GroupUser, origin?: string) {
        super(obj, origin);
        this.userId = obj.user.id;
        this.groupId = obj.group.id;
    }
}
