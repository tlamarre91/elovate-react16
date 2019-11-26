import winston from "winston";

import {
    UserProps,
    GroupProps
} from "../../api";

import {
    getRepository,
    Entity,
    Column,
    Index,
    JoinTable,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    ManyToMany
} from "typeorm";

import {
    IsEmail
} from "class-validator";

const log: winston.Logger = winston.loggers.get("base-logger");

export { User } from "./User";
export { Match } from "./Match";
export { Game } from "./Game";
export { Group } from "./Group";
export { ImageAsset } from "./assets";

//@Entity()
//export class Party extends EntityWithId {
//    constructor(users?: User[]) {
//        super();
//        this.users = users;
//    }
//
//    @ManyToMany(type => Match)
//    matches: Match[];
//
//    @ManyToMany(type => User)
//    users: User[];
//
//    async addUser(user: User): Promise<Party> {
//        const userRepo = getRepository(User);
//        user.parties.push(this);
//        try {
//            await userRepo.save(user);
//            return getRepository(Party).save(this);
//        } catch (err) {
//            log.error(err);
//        }
//    }
//}
