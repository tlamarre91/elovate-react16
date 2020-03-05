import * as Orm from "typeorm";
import { User } from "./User";
import { Group } from "./Group";
import { Match } from "./Match";
import { Resource } from "../Resource";

export enum PartyType {
    adhoc = "a",
    premade = "p"
}

@Orm.Entity()
export class Party extends Resource {
    @Orm.ManyToMany(() => User, user => user.parties)
    users: User[];

    //@Orm.ManyToOne(() => Match, match => match.parties)
    //match: Match;

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
