import * as Orm from 'typeorm';
import {
    User,
} from '.';

export class CreationInfo {
    @Orm.Column({ default: () => 'NOW()' })
    edited: Date;

    @Orm.Column({ type: 'timestamp', default: () => 'NOW()' })
    dateCreated: Date;

    @Orm.ManyToOne(() => User, { nullable: true })
    createdBy?: User;
}
