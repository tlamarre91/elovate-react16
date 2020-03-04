export class BaseDto<T> {
    origin: string;
    constructor(base: T, origin?: string) {
        this.origin = origin;
    }
}

