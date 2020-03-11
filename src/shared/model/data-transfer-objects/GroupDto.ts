import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import * as Entity from "../entities";

export class GroupDto extends BaseDto<Entity.Group> {
    name?: string;
    customUrl?: string;
    dateCreated?: Date;
    publicVisible?: boolean;
    publicJoinable?: boolean;
    memberships?: Dto.GroupUserDto[];
    parties?: Dto.PartyDto[];

    constructor(obj: Entity.Group, origin?: string) {
        super(obj, origin);
    }
}
