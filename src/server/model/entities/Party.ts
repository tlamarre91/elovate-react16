import * as Orm from "typeorm";
import { Creation } from "./Creation";
import { Group } from "./Group";
import { Match } from "./Match";
import { Owners } from "./Owners";
import { User } from "./User";

export enum PartyType {
    adhoc = "a",
    premade = "p"
}

@Orm.Entity()
export class Party {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column(() => Creation)
    creationInfo: Creation;

    @Orm.Column(() => Owners)
    owners: Owners;

    @Orm.ManyToMany(() => User, user => user.parties)
    users: User[];

    @Orm.ManyToOne(() => Match, match => match.parties)
    match: Match;

    @Orm.Column()
    partyNumber: number;

    @Orm.Column({
        type: "enum",
        enum: PartyType,
        default: PartyType.adhoc
    })
    partyType: PartyType;

    @Orm.ManyToOne(() => Group, group => group.parties)
    group: Group;
}
