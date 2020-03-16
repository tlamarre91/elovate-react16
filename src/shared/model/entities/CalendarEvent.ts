import * as Orm from "typeorm";
import { Resource } from "./Resource";

@Orm.Entity()
export class CalendarEvent extends Resource {
    @Orm.Column({ default: () => "NOW()" })
    dateCreated: Date;

    @Orm.Column()
    scheduledStart: Date;

    @Orm.Column()
    scheduledEnd: Date
}
