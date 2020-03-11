import * as Orm from "typeorm";
import { User, Group } from "./entities";

export class Resource {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.ManyToOne(() => User, { nullable: true })
    createdBy: User;

    @Orm.ManyToOne(() => User, { nullable: true })
    ownerUser: User;

    @Orm.ManyToOne(() => Group, { nullable: true })
    ownerGroup: Group;
}
