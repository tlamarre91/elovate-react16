import * as Orm from "typeorm";
import * as argon from "argon2";

import { User } from "../entities";

@Orm.EntityRepository(User)
export class UserRepository extends Orm.Repository<User> {
//    search(params: Api.UserSearchParams): Promise<User[]> {
//        if (params.searchType === Api.SearchType.ContainsAll) {
//            return this.find({
//                username: Like(`%${ params.searchProps.username }%`) // TODO: Factor out, check each field in Partial<UserProps>
//            });
//        } else {
//            const err = `search type not yet implemented: ${ params.searchType }`;
//            log.error(err);
//            throw Error(err);
//        }
//    }

    async getRandom(): Promise<User> {
        const allUsers: User[] = await this.find({ select: ["id"] });
        return allUsers[Math.floor(Math.random() * allUsers.length)];
    }

    async verifyPassword(user: User, password: string): Promise<boolean> {
        if (! user.passwordDigest) {
            throw Error(`user (${ user.email }) has no password set`);
        } else {
            return argon.verify(user.passwordDigest, password);
        }
    }

    /*
     * set a user's password. NOTE: validation must be performed prior to calling
     */
    async setPassword(user: User, password: string): Promise<User> {
        user.passwordDigest = await argon.hash(password);
        return this.save(user);
    }

//     async findUserParties(userId: number): Promise<MatchParty[]> {
//         return this.findOne({
//             where: { id: userId },
//             join: {
//                 alias: "user",
//                 leftJoinAndSelect: {
//                     matchParties: "user.matchParties"
//                 }
//             }
//         }).then(user => user.matchParties);
//     }

//    async findUserMatches(userId: number): Promise<Match[]> {
//        return this.findOne({
//            where: { id: userId },
//            join: {
//                alias: "user",
//                leftJoinAndSelect: {
//                    matches: "user.matches"
//                }
//            }
//        }).then(u => u.matches);
//    }
}

