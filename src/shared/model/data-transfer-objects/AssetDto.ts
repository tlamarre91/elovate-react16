import * as Dto from ".";
import { BaseDto } from "../BaseDto";
import { ImageAsset } from "../entities/Asset";

export class ImageAssetDto extends BaseDto<ImageAsset> {
    // TODO: file permissions should be fun...
    id?: number;
    uri: string;
    height?: number;
    width?: number;

    constructor(obj: ImageAsset, origin?: string) {
        super(obj, origin);
        this.uri = obj.uri;
        return this;
    }
}
