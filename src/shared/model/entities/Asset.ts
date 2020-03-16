import * as Orm from "typeorm";
import { Resource } from "./Resource";

abstract class FileAsset extends Resource {
    @Orm.Column()
    uri: string;
}

@Orm.Entity()
export class ImageAsset extends FileAsset {
    @Orm.Column()
    height: number;

    @Orm.Column({ type: "integer" })
    width: number;
}

