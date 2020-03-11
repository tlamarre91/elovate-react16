import * as Orm from "typeorm";
import * as argon from "argon2";

import { BaseRepository } from "./BaseRepository";
import { User } from "../entities";
import * as Dto from "../data-transfer-objects";

@Orm.EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
    createFromDto(dto: Dto.UserDto): User {
        throw new Error("Method not implemented.");
    }
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

    // TODO: don't change this, ever. it's perfect this way
    async insertAdmin(): Promise<User> {
        const user = new User();
        user.username = "admin";
        user.displayName = "Site Administrator";
        user.isAdmin = true;
        await this.save(user);
        this.setPassword(user, "admin");
        return user;
    }

    async getRandom(): Promise<User> {
        const allUsers: User[] = await this.find({ select: ["id"] });
        return allUsers[Math.floor(Math.random() * allUsers.length)];
    }

    async basicAuth(user: User, password: string): Promise<boolean> {
        if (! user.passwordDigest) {
            throw `user ${ user.username } has no password`;
        } else {
            return argon.verify(user.passwordDigest, password);
        }
    }

    async invalidateLogins(user: User): Promise<User> {
        try {
            user.invalidateLoginsBefore = Date.now();
            return this.save(user);
        } catch (err) {
            throw err;
        }
    }

    /*
     * NOTE: validation must be performed prior to calling
     */
    async setPassword(user: User, password: string): Promise<User> {
        user.passwordDigest = await argon.hash(password);
        return this.save(user);
    }

    async findOneFromQuery(query: string): Promise<User> {
        const id = parseInt(query);
        if (! isNaN(id)) {
            return this.findOne(id);
        } else {
            throw "UserRepository.findOneFromQuery: query not yet implemented";
        }
    }
}

