export class BaseDto<T> {
    origin?: string;
    ownerUserId?: number;
    ownerGroupId?: number;
    constructor(base: T, origin?: string) {
        this.origin = origin;
    }
}

