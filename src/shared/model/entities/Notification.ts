import * as Orm from "typeorm";
import * as Entity from ".";
import { Resource } from "../Resource";

// TODO: notification "thumbnails" or whatever should be computed from context.
@Orm.Entity()
export class Notification extends Resource {
    @Orm.ManyToOne(() => Entity.User, user => user.notifications)
    recipient: Entity.User;

    @Orm.Column({ type: "date", default: "NOW()" })
    @Orm.Index()
    dateCreated: Date;

    @Orm.Column()
    read: boolean;

    @Orm.Column({ length: 128 })
    message: string;

    @Orm.Column({ nullable: true })
    linkedResourceUri?: string;
}