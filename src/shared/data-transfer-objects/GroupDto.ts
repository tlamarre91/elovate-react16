import * as Dto from ".";
import { BaseDto } from "./BaseDto";
import { Group } from "~server/model/entities/Group";

export class GroupDto extends BaseDto<Group> {
    name?: string;
    customUrl?: string;
    dateCreated?: Date;
    publicVisible?: boolean;
    publicJoinable?: boolean;
    memberships?: Dto.GroupUserDto[];
    parties?: Dto.PartyDto[];

    constructor(obj?: Group, origin?: string) {
            super(obj, origin);
            this.name = obj?.name;
            this.customUrl = obj?.customUrl;
            this.dateCreated = obj?.creationInfo?.dateCreated;
            this.publicVisible = obj?.publicVisible;
            this.publicJoinable = obj?.publicJoinable;
    }
}
