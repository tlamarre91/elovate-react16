import * as Dto from '.';
import { BaseDto } from './BaseDto';
import {
    GroupUser,
} from '~server/model/entities';

import {
    GroupUserApproval,
    GroupUserPrivilege,
} from '~shared/enums';

export class GroupUserDto extends BaseDto<GroupUser> {
    user?: Dto.UserDto;

    group?: Dto.GroupDto;

    privilege: GroupUserPrivilege;

    groupApproval: GroupUserApproval;

    userApproval: GroupUserApproval;

    constructor(obj: GroupUser, origin?: string) {
        super(obj, origin);
        this.user = new Dto.UserDto(obj?.user) ?? null;
        this.group = new Dto.GroupDto(obj?.group) ?? null;
        this.privilege = obj?.privilege ?? null;
        this.groupApproval = obj?.groupApproval ?? null;
        this.userApproval = obj?.userApproval ?? null;
    }
}
