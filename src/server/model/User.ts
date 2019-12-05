//import winston from "winston";

import { log } from "../log";

import {
    getRepository,
    Repository,
    EntityRepository,
    BaseEntity,
    Entity,
    Column,
    Index,
    JoinTable,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    ManyToMany,
    Like
} from "typeorm";

import * as Api from "../../api";

import { MappedEntity } from "./MappedEntity";
import { Group, GroupRepository } from "./Group";
import { Match, MatchRepository } from "./Match";
import { ImageAsset, ImageAssetRepository } from "./assets";
import { MatchParty } from "./MatchParty";

@Entity()
export class User extends MappedEntity<Api.UserProps> {
    toProps() {
        return { ... this, avatarAssetUrl: "TODOOOO" }; // TODO: resolve asset path here
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: () => "NOW()" })
    dateCreated: Date;

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

    @Column({ default: false })
    isPublic: boolean;

    @ManyToMany(type => Group, group => group.members)
    groups: Group[];

    @ManyToMany(type => MatchParty, matchParty => matchParty.users, { cascade: true })
    @JoinTable()
    matchParties: MatchParty[];
}

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    search(params: Api.UserSearchParams): Promise<User[]> {
        if (params.searchType === Api.SearchType.ContainsAll) {
            return this.find({
                username: Like(`%${ params.searchProps.username }%`) // TODO: Factor out, check each field in Partial<UserProps>
            });
        } else {
            const err = `match type not yet implemented: ${ params.searchType }`;
            log.error(err);
            throw Error(err);
        }
    }

    createWithProps(props: Api.UserProps): Promise<User> {
        const user = this.create();
        user.username = props.username;
        user.displayName = props.displayName;
        user.email = props.email;
        return this.save(user);
    }

    async getRandom(): Promise<User> {
        const allUsers: User[] = await this.find({ select: ["id"] });
        return allUsers[Math.floor(Math.random() * allUsers.length)];
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
