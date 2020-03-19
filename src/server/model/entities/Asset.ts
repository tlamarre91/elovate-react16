import * as Orm from "typeorm";

import {
    Creation,
    Owners,
} from ".";


abstract class FileAsset {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column(() => Creation)
    creationInfo: Creation;

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

