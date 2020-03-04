import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import * as Entity from "../entities";

export class ImageAssetDto extends BaseDto<Entity.ImageAsset> {
    // TODO: file permissions should be fun...
    id?: number;
    uri: string;
    height?: number;
    width?: number;

    constructor(base: Entity.ImageAsset, origin?: string) {
        super(base, origin);
        this.id = base.id;
        this.uri = base.uri;
        return this;
    }
}
