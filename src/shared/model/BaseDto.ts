import { Resource } from "./Resource";
// TODO: put this down in the dto module
export class BaseDto<T extends Resource> {
    origin?: string;
    id?: number;
    permissionPolicy: number;
    ownerUserId?: number;
    ownerGroupId?: number;
    constructor(obj: T, origin?: string) {
        this.origin = origin;
        this.id = obj.id;
        this.permissionPolicy = obj.permissionPolicy;
    }
}

