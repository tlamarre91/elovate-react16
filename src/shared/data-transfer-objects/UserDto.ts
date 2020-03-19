import * as Dto from ".";
import { BaseDto } from "./BaseDto";
import { User } from "~server/model/entities/User";

export class UserDto extends BaseDto<User> {
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

    constructor(obj: User, origin?: string) {
        super(obj, origin);
        this.dateCreated = obj.creationInfo.dateCreated;
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
