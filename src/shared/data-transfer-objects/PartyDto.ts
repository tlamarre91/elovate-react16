import * as Dto from ".";
import { BaseDto } from "./BaseDto";
import { Party } from "~server/model/entities/Party";

export class PartyDto extends BaseDto<Party> {
    constructor(obj: Party, origin?: string) {
        super(obj, origin);
    }
}
