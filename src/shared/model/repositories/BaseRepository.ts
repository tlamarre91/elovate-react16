import * as Orm from "typeorm";

import { BaseDto } from "../BaseDto";
import { Resource } from "../Resource";

export abstract class BaseRepository<T extends Resource> extends Orm.Repository<T> {
    abstract findOneFromQuery(query: string): Promise<T>;
    abstract createFromDto(dto: BaseDto<T>): T;
}
