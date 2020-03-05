import * as Orm from "typeorm";

import * as Entity from "../entities";

@Orm.EntityRepository(Entity.Party)
export class PartyRepository extends Orm.Repository<Entity.Party> {
    createParty(users: Entity.User[], match: Entity.Match, partyNumber: number, partyType: Entity.PartyType): Promise<Entity.Party> {
        const party = this.create();
        party.users = users;
        //party.match = match;
        party.partyNumber = partyNumber;
        party.partyType = partyType;
        return this.save(party);
    }

    addUserToParty(user: Entity.User, party: Entity.Party) {
        if (party.users.includes(user)) {
            throw Error(`user ${user.id} is already in party ${party.id}`);
        }

        user.parties.push(party);
        party.users.push(user);
        //user.save(); // TODO: save both sides of the relation!!!
        this.save(party);
    }

    removeUserFromParty(user: Entity.User, party: Entity.Party): Promise<Entity.Party> {
        if (! party.users.includes(user)) {
            return null;
        }
    }
}
