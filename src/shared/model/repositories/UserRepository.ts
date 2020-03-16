import * as Orm from "typeorm";
import * as argon from "argon2";

import { log } from "~shared/log";
import { BaseRepository } from "./BaseRepository";
import { User, Group } from "../entities";
import * as Dto from "../data-transfer-objects";

@Orm.EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
    async createFromDto(dto: Dto.UserDto): Promise<User> {
        try {
            const user = this.create();
            user.displayName = dto.displayName ?? null;
            user.email = dto.email ?? null;
            user.emailVerified = dto.emailVerified ?? false;
            user.hasAccount = dto.hasAccount ?? false;
            user.isAdmin = false;
            user.receivesEmail = dto.receivesEmail ?? false;
            user.username = dto.username ?? null;

            if (dto.createdById) {
                user.createdBy = await this.findOne(dto.createdById);
            }

            if (dto.ownerUserId) {
                user.ownerUser = await this.findOne(dto.ownerUserId);
            }

            if (dto.ownerUserId) {
                const groupRepo = Orm.getRepository(Group);
                user.ownerGroup = await groupRepo.findOne(dto.ownerGroupId);
            }

            dto.groupMemberships.forEach(guDto => {
                console.log(`${guDto.userId} wants to be in ${guDto.groupId}`);
            });

            return user;
        } catch (err) {
            return null;
        }
    }

    async updateFromDto(user: User, dto: Dto.UserDto): Promise<User> {
        try {
            user.ownerUser = await this.findOne(dto.ownerUserId);
            const groupRepo = Orm.getRepository(Group);
            user.ownerGroup = await groupRepo.findOne(dto.ownerGroupId);
            user.username = dto.username;
            user.displayName = dto.displayName ?? null;
            user.email = dto.email ?? null;
            user.emailVerified = dto.emailVerified ?? false;
            user.hasAccount = dto.hasAccount ?? false;
            user.receivesEmail = dto.receivesEmail ?? false;

            dto.groupMemberships.forEach(guDto => {
                console.log(`${guDto.userId} wants to be in ${guDto.groupId}`);
            });

            return this.save(user);
        } catch (err) {
            console.log(err);
            return null;
        }
    }

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
            user.invalidateLoginsBefore = Math.floor(Date.now() / 1000);
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

    async findVisibleToUser(user: User): Promise<User[]> {
        throw "not yet implemented";
    }
}

