import * as Orm from "typeorm";

import { BaseDto } from "../BaseDto";

export abstract class BaseRepository<T> extends Orm.Repository<T> {
    abstract findOneFromQuery(query: string): Promise<T>;
    abstract createFromDto(dto: BaseDto<T>): Promise<T>;
}
