import { UserProps } from "../../api";
import winston from "winston";

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

export abstract class EntityWithId {
    @PrimaryGeneratedColumn()
    id: number;
}

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

@Entity()
export class User extends EntityWithId {
    constructor(props?: UserProps) {
        super();
        if (props) {
            this.username = props.username;
        }
    }

    @Index({ unique: true })
    @Column({ length: 64 })
    username: string;

    @Column({ length: 64, default: "" })
    displayName: string;
    
    @Column({ length: 64, default: "" })
    email: string;

    @Column({ default: false })
    hasAccount: boolean;

//    @ManyToMany(type => Party)
//    @JoinTable()
//    parties: Party[];

    static async getRandom(): Promise<User> {
        const userRepository = getRepository(this);
        const ids = await userRepository.find({ select: ["id"] });
        const randId = ids[Math.floor(Math.random() * ids.length)];
        return userRepository.findOne(randId);
    }
}

@Entity()
export class Match extends EntityWithId {
    @Column()
    name: string;

//    @ManyToMany(type => Party)
//    @JoinTable()
//    parties: Party[];
}
