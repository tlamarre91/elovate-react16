import * as Orm from "typeorm";
import { User } from "./User";

// TODO: notification "thumbnails" or whatever should be computed from context.
@Orm.Entity()
export class Notification {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column({ default: () => "NOW()" })
    @Orm.Index()
    created: Date;

    @Orm.ManyToOne(() => User, user => user.notifications)
    recipient: User;

    @Orm.Index()
    @Orm.Column()
    read: boolean;

    @Orm.Column({ length: 128 })
    message: string;

    @Orm.Column({ nullable: true })
    linkedResourceUri?: string;
}
