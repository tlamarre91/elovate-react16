import * as Orm from "typeorm";
import { Creation } from "./Creation";
import { Group } from "./Group";
import { Owners } from "./Owners";
import { User } from "./User";

@Orm.Entity()
export class CalendarEvent {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column(() => Creation)
    creationInfo: Creation;

    @Orm.Column(() => Owners)
    owners: Owners;

    @Orm.Column()
    scheduledStart: Date;

    @Orm.Column()
    scheduledEnd: Date
}
