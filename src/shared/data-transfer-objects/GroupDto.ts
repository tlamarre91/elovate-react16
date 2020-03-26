import * as Dto from ".";
import { BaseDto } from "./BaseDto";
import { Group } from "~server/model/entities/Group";

export class GroupDto extends BaseDto<Group> {
    name?: string;
    customUrl?: string;
    dateCreated?: Date;
    description: string;
    publicVisible?: boolean;
    publicJoinable?: boolean;
    memberships?: Dto.GroupUserDto[];
    teams?: Dto.TeamDto[];

    constructor(obj?: Group, origin?: string) {
        super(obj, origin);
        this.customUrl = obj?.customUrl;
        this.description = obj?.description;
        this.dateCreated = obj?.creationInfo?.dateCreated;
        this.name = obj?.name;
        this.publicJoinable = obj?.publicJoinable;
        this.publicVisible = obj?.publicVisible;
        this.memberships = obj?.memberships?.map(m => new Dto.GroupUserDto(m));
    }
}
