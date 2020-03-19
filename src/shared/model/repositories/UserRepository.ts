import * as Orm from "typeorm";
import * as argon from "argon2";
import * as emailValidator from "email-validator";

import { blacklists } from "~shared/util";
import { log } from "~shared/log";
import { BaseRepository } from "./BaseRepository";
import { User } from "../entities/User";
import { Group } from "../entities/Group";
import { GroupUser } from "../entities/GroupUser";
import * as Dto from "../data-transfer-objects";

type NewUserParams = {
    username?: string,
    password?: string,
    email?: string
};

@Orm.EntityRepository(User)
export class UserRepository extends BaseRepository<User> {
    // TODO: improved validation rules. also... type checking on server side is basically nowhere. what happened to that dream?
    async validateNewUser(params: NewUserParams): Promise<NewUserParams> {
        const errors: typeof params = {};

        if (params?.username?.length > -1) {
            if (params?.username?.length === 0) {
                errors.username = "Provide a username";
            } else if (blacklists.username.includes(params.username)) {
                errors.username = "Please choose another username"; // TODO: maybe set same string as below...
            } else if (await this.count({ where: { username: params.username } }).then(count => count > 0)) {
                errors.username = `Username ${params.username} already in use`;
            }
        }

        if (params?.password?.length > -1) {
            if (params?.password?.length < 8) {
                errors.password = "Please choose a password with at least 8 characters";
            }
        }

        if (params.email?.length > -1) {
            if (! emailValidator.validate(params.email)) {
                errors.email = "Please enter a valid email address";
            } else if (await this.count({ where: { email: params.email } }).then(count => count > 0)) {
                errors.email = `Email address ${params.email} already in use`;
            }
        }

        return errors;
    }

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
                user.creationInfo.createdBy = await this.findOne(dto.createdById);
            }

            if (dto.ownerUserId) {
                user.owners.user = await this.findOne(dto.ownerUserId);
            }

            if (dto.ownerUserId) {
                const groupRepo = Orm.getRepository(Group);
                user.owners.group = await groupRepo.findOne(dto.ownerGroupId);
            }

            return user;
        } catch (err) {
            return null;
        }
    }

    async updateFromDto(user: User, dto: Dto.UserDto): Promise<User> {
        try {
            user.owners.user = await this.findOne(dto.ownerUserId);
            const groupRepo = Orm.getRepository(Group);
            user.owners.group = await groupRepo.findOne(dto.ownerGroupId);
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
        user.passwordDigest = await argon.hash("password");
        user.displayName = "Site Administrator";
        user.isAdmin = true;
        return this.save(user);;
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

    async register(params: { username: string, password: string, email: string }): Promise<User> {
        const user = this.create();
        user.username = params.username;
        user.passwordDigest = await argon.hash(params.password);
        user.email = params.email;
        user.invalidateLoginsBefore = Math.floor(Date.now() / 1000 - 1);
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

