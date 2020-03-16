import * as Orm from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

abstract class FileAsset {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column({ default: () => "NOW()" })
    created: Date;

    @Orm.Column({ default: () => "NOW()" })
    edited: Date;

    @Orm.ManyToOne(() => User, { nullable: true })
    createdBy?: User;

    @Orm.ManyToOne(() => User, { nullable: true })
    ownerUser?: User;

    @Orm.ManyToOne(() => Group, { nullable: true })
    ownerGroup?: Group;

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

