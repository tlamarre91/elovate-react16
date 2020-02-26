import { BaseEntity } from "typeorm";

import { EntityProps } from "~shared/props";

export abstract class MappedEntity<T extends EntityProps> extends BaseEntity {
    abstract toProps(): T;
}
