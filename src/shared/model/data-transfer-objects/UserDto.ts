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
    emailVerified?: boolean;
    hasAccount?: boolean;
    receivesEmail?: boolean;
    publicVisible?: boolean;
    groupMemberships?: Dto.GroupUserDto[];
    parties?: Dto.PartyDto[];

    constructor(obj: Entity.User, origin?: string) {
        super(obj, origin);
        this.dateCreated = obj.dateCreated;
        this.username = obj.username;
        this.displayName = obj.displayName;
        this.email = obj.email;
        this.lastLogin = obj.lastLogin;

        if (obj.groupMemberships) {
            this.groupMemberships = obj.groupMemberships.map(gu => new Dto.GroupUserDto(gu));
        }

        if (obj.parties) {
            this.parties = obj.parties.map(p => new Dto.PartyDto(p));
        }

        if (obj.avatarAsset) {
            this.avatarAsset = new Dto.ImageAssetDto(obj.avatarAsset);
        }
    }
}
