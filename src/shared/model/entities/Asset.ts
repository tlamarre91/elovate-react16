import * as Orm from "typeorm";

abstract class FileAsset {
    @Orm.Column()
    uri: string;
}

@Orm.Entity()
export class ImageAsset extends FileAsset {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column()
    height: number;

    @Orm.Column({ type: "integer" })
    width: number;
}

