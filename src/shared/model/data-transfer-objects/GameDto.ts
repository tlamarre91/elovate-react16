import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import * as Entity from "../entities";

export class GameDto extends BaseDto<Entity.Game> {
    id?: number;
    dateCreated?: Date;
    name?: string;

    constructor(base: Entity.Game, origin?: string) {
        super(base, origin);
        this.id = base.id;
        return this;
    }
}
