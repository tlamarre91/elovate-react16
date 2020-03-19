import * as Orm from "typeorm";

import {
    Creation,
    Owners
} from ".";

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
