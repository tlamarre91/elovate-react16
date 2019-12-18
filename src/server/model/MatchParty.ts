import {
    getRepository,
    Repository,
    EntityRepository,
    Entity,
    Column,
    Index,
    JoinTable,
    PrimaryGeneratedColumn,
    OneToOne,
    ManyToOne,
    OneToMany,
    ManyToMany
} from "typeorm";

import * as Api from "../../api";

import { MappedEntity } from "./MappedEntity";
import { User } from "./User";
import { Game } from "./Game";
import { Group } from "./Group";
import { Match } from "./Match";

export enum MatchPartyType {
    adhoc = "adhoc",
    premade = "premade", // "team?" "named?" "season?"
}

@Entity()
export class MatchParty {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(type => User, user => user.matchParties)
    users: User[];

    @ManyToOne(type => Match, match => match.matchParties)
    match: Match;

    @Column()
    partyNumber: number;

    @Column({
        type: "enum",
        enum: MatchPartyType,
        default: MatchPartyType.adhoc
    })
    partyType: MatchPartyType;

    @ManyToOne(type => Group, group => group.matchParties)
    group: Group;
}

@EntityRepository(MatchParty)
export class MatchPartyRepository extends Repository<MatchParty> {
    createParty(users: User[], match: Match, partyNumber: number, partyType: MatchPartyType): Promise<MatchParty> {
        const party = this.create();
        party.users = users;
        party.match = match;
        party.partyNumber = partyNumber;
        party.partyType = partyType;
        return this.save(party);
    }

    addUserToParty(user: User, party: MatchParty) {
        if (party.users.includes(user)) {
            throw Error(`user ${user.id} is already in party ${party.id}`);
        }

        user.matchParties.push(party);
        party.users.push(user);
        user.save();
        this.save(party);
    }

    removeUserFromParty(user: User, party: MatchParty): Promise<MatchParty> {
        if (! party.users.includes(user)) {
            return null;
        }
    }
}
