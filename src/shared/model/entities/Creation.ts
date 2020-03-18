import * as Orm from "typeorm";
import { User } from "./User";

export class Creation {
    @Orm.Column({ default: () => "NOW()" })
    created: Date;

    @Orm.Column({ default: () => "NOW()" })
    edited: Date;

    @Orm.Column({ type: "timestamp", default: () => "NOW()" })
    dateCreated: Date;

    @Orm.ManyToOne(() => User, { nullable: true })
    createdBy?: User;
}
