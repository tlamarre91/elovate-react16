import * as Orm from 'typeorm';
import {
    CreationInfo, Group, Match, MatchParty, Owners, User,
} from '.';

//import { TeamType } from '~shared/enums';
import * as Enums from "../../../shared/enums";

@Orm.Entity()
export class Team {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column(() => CreationInfo)
    creationInfo: CreationInfo;

    @Orm.Column(() => Owners)
    owners: Owners;

    @Orm.ManyToMany(() => User, (user) => user.teams)
    users: User[];

    @Orm.Column({
        type: 'enum',
        enum: Enums.TeamType,
        default: Enums.TeamType.adhoc,
    })
    teamType: Enums.TeamType;

    @Orm.ManyToOne(() => Group, (group) => group.teams)
    group: Group;

    @Orm.OneToMany(() => MatchParty, (matchParty) => matchParty.team)
    parties: MatchParty[];
}
