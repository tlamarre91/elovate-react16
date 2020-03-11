import * as Orm from "typeorm";
import { User } from "./User";

@Orm.Entity()
export class ActivityLogEntry {
    @Orm.Column()
    datetime: Date;

    @Orm.ManyToOne(() => User, { nullable: true })
    user: User;

    @Orm.Column({ length: 128 })
    message: String;
}
