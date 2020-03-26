import * as Orm from 'typeorm';

import {
    CreationInfo,
    Group,
    Match,
    Owners,
    Team,
    User,
} from '.';

@Orm.Entity()
export class MatchParty {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column(() => CreationInfo)
    creationInfo: CreationInfo;

    @Orm.Column(() => Owners)
    owners: Owners;

    @Orm.Column()
    partyNumber: number;

    @Orm.ManyToOne(() => Match, (match) => match.parties)
    match: Match;

    @Orm.ManyToOne(() => Team, (team) => team.parties)
    team: Team;
}
