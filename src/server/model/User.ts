import winston from "winston";

import {
    getRepository,
    Repository,
    EntityRepository,
    Entity,
    Column,
    Index,
    JoinTable,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    ManyToMany
} from "typeorm";

import * as Api from "../../api";

import { Group, GroupRepository } from "./Group";
import { Match, MatchRepository } from "./Match";
import { ImageAsset, AssetRepository } from "./assets";

@Entity()
export class User implements Api.MapsTo<Api.UserProps> {
    // ERRRR. i'm pretty sure i should nooooot be using a constructor
    // or at least not with a Partial of any type
//     constructor(props: Partial<Api.UserProps>) {
//         //let providedProps = { ... props };
//         // TODO: actually do validation
//         if (! props.username) {
//             const err = "username required to create user";
//             //log.error(err);
//             throw Error(err);
//         } else if (! props.email) {
//             const err = "email required to create user";
//             //log.error(err);
//             throw Error(err);
//         }
// 
//         this.username = props.username;
//         this.email = props.email;
//         this.displayName = props.displayName;
//     }

    toProps() {
        return { ... this, avatarAssetUrl: "TODOOOO" }; // TODO: resolve asset path here
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => ImageAsset)
    avatarAsset: ImageAsset;

    @Index({ unique: true })
    @Column({ length: 64 })
    username: string;

    @Column({ length: 64, default: "" })
    displayName: string;
    
    @Column({ length: 64, default: "" })
    email: string;

    @Column({ default: false })
    hasAccount: boolean;

    @ManyToMany(type => Group, group => group.members)
    groups: Group[];

    @ManyToMany(type => Match, match => match.players)
    matches: Match[];

    static async getRandom(): Promise<User> {
        const userRepository = getRepository(this);
        const ids = await userRepository.find({ select: ["id"] });
        const randId = ids[Math.floor(Math.random() * ids.length)];
        return userRepository.findOne(randId);
    }
}

@EntityRepository(User)
export class UserRepository extends Repository<User> {
}
