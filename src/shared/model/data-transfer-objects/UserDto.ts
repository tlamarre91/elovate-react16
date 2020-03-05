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
    matchParties?: Dto.MatchPartyDto[];

    constructor(base: Entity.User, origin?: string) {
        super(base, origin);
        this.id = base.id;
        this.dateCreated = base.dateCreated;
        this.lastLogin = base.lastLogin;
        //this.avatarAsset = new Dto.ImageAssetDto(base.avatarAsset);
    }
}
