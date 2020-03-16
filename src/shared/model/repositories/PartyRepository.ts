import * as Orm from "typeorm";

import { BaseRepository } from "./BaseRepository";
import { Party, PartyType } from "~shared/model/entities/Party";
import { Match } from "~shared/model/entities/Match";
import { User } from "~shared/model/entities/User";
import * as Dto from "../data-transfer-objects";

@Orm.EntityRepository(Party)
export class PartyRepository extends BaseRepository<Party> {
    findOneFromQuery(query: string): Promise<Party> {
        throw new Error("Method not implemented.");
    }

    createFromDto(dto: Dto.PartyDto): Promise<Party> {
        throw new Error("Method not implemented.");
    }

    createParty(users: User[], match: Match, partyNumber: number, partyType: PartyType): Promise<Party> {
        const party = this.create();
        party.users = users;
        //party.match = match;
        party.partyNumber = partyNumber;
        party.partyType = partyType;
        return this.save(party);
    }

    addUserToParty(user: User, party: Party) {
        if (party.users.includes(user)) {
            throw Error(`user ${user.id} is already in party ${party.id}`);
        }

        user.parties.push(party);
        party.users.push(user);
        //user.save(); // TODO: save both sides of the relation!!!
        this.save(party);
    }

    removeUserFromParty(user: User, party: Party): Promise<Party> {
        if (! party.users.includes(user)) {
            return null;
        }
    }
}
