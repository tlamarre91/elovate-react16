export class BaseDto<T extends { id?: number, origin?: string }> {
    origin?: string;

    id?: number;

    createdById: number;

    ownerUserId?: number;

    ownerGroupId?: number;

    constructor(obj?: T, origin?: string) {
        this.origin = origin ?? null;
        this.id = obj?.id ?? null;
    }

    copyFrom(dto: BaseDto<T>) {
        Object.assign(this, dto);
    }
}
