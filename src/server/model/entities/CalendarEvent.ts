import * as Orm from 'typeorm';

import {
    CreationInfo,
    Owners,
} from '.';

@Orm.Entity()
export class CalendarEvent {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column(() => CreationInfo)
    creationInfo: CreationInfo;

    @Orm.Column(() => Owners)
    owners: Owners;

    @Orm.Column()
    scheduledStart: Date;

    @Orm.Column()
    scheduledEnd: Date
}
