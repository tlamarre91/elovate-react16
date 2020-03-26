import * as Orm from 'typeorm';
import { User } from './User';
import { Group } from './Group';

export class Owners {
    @Orm.ManyToOne(() => User)
    @Orm.JoinColumn({ name: 'ownerUser' })
    user: User;

    @Orm.ManyToOne(() => Group)
    @Orm.JoinColumn({ name: 'ownerGroup' })
    group: Group;
}
