import * as Orm from "typeorm";

import { MatchParty, MatchPartyType, Match, User } from "../entities";

@Orm.EntityRepository(MatchParty)
export class MatchPartyRepository extends Orm.Repository<MatchParty> {
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
        //user.save(); // TODO: save both sides of the relation!!!
        this.save(party);
    }

    removeUserFromParty(user: User, party: MatchParty): Promise<MatchParty> {
        if (! party.users.includes(user)) {
            return null;
        }
    }
}
