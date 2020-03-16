import * as Orm from "typeorm";
import { Group } from "./Group";
import { Match } from "./Match";
import { User } from "./User";

export enum PartyType {
    adhoc = "a",
    premade = "p"
}

@Orm.Entity()
export class Party {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column({ default: () => "NOW()" })
    created: Date;

    @Orm.Column({ default: () => "NOW()" })
    edited: Date;

    @Orm.ManyToOne(() => User, { nullable: true })
    createdBy?: User;

    @Orm.ManyToOne(() => User, { nullable: true })
    ownerUser?: User;

    @Orm.ManyToOne(() => Group, { nullable: true })
    ownerGroup?: Group;
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
