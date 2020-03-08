import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import * as Entity from "../entities";

export class UserDto extends BaseDto<Entity.User> {
    id?: number;
    dateCreated?: Date;
    lastLogin?: Date;
    avatarAsset?: Dto.ImageAssetDto;
    username?: string;
    displayName?: string;
    email?: string;
    groupMemberships?: Dto.GroupUserDto[];
    matchParties?: Dto.PartyDto[];

    constructor(obj: Entity.User, origin?: string) {
        super(obj, origin);
        this.dateCreated = obj.dateCreated;
        this.lastLogin = obj.lastLogin;
        //this.avatarAsset = new Dto.ImageAssetDto(base.avatarAsset);
    }
}
