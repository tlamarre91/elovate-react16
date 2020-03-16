import * as Orm from "typeorm";
import { Group } from "./Group";
import { User } from "./User";

@Orm.Entity()
export class CalendarEvent {
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
    @Orm.Column({ default: () => "NOW()" })
    dateCreated: Date;

    @Orm.Column()
    scheduledStart: Date;

    @Orm.Column()
    scheduledEnd: Date
}
