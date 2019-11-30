import { BaseEntity } from "typeorm";

import { EntityProps } from "../../api";

export abstract class MappedEntity<T extends EntityProps> extends BaseEntity {
    abstract toProps(): T;
}
