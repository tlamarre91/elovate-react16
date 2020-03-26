import * as Orm from "typeorm";

import {
    CreationInfo,
    Owners,
} from ".";


abstract class FileAsset {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column(() => CreationInfo)
    creationInfo: CreationInfo;

    @Orm.Column(() => Owners)
    owners: Owners;

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

