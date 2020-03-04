import * as Orm from "typeorm";
import * as Entity from ".";
import { Resource } from "../Resource";

export enum MatchPartyType {
    adhoc = "a",
    premade = "p"
}

@Orm.Entity()
export class MatchParty extends Resource {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.ManyToMany(() => Entity.User, user => user.matchParties)
    users: Entity.User[];

    @Orm.ManyToOne(() => Entity.Match, match => match.matchParties)
    match: Entity.Match;

    @Orm.Column()
    partyNumber: number;

    @Orm.Column({
        type: "enum",
        enum: MatchPartyType,
        default: MatchPartyType.adhoc
    })
    partyType: MatchPartyType;

    @Orm.ManyToOne(() => Entity.Group, group => group.matchParties)
    group: Entity.Group;
}
