import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import * as Entity from "../entities";

export class ImageAssetDto extends BaseDto<Entity.ImageAsset> {
    // TODO: file permissions should be fun...
    id?: number;
    uri: string;
    height?: number;
    width?: number;

    constructor(obj: Entity.ImageAsset, origin?: string) {
        super(obj, origin);
        this.uri = obj.uri;
        return this;
    }
}
