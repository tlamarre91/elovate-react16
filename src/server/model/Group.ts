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

import * as Api from "~shared/api";
import * as Props from "~shared/props";

import { MappedEntity } from "./MappedEntity";
import { User } from "./User";
import { MatchParty } from "./MatchParty";

@Entity()
export class Group extends MappedEntity<Props.GroupProps> {
    toProps() {
        return { ... this }; // TODO: no way this is good enough. will restrict to actual GroupProps properties
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ default: () => "NOW()" })
    dateCreated: Date;

    @ManyToMany(type => User, user => user.groups)
    @JoinTable()
    members: User[];

    @OneToMany(type => MatchParty, matchParty => matchParty.group)
    @JoinTable()
    matchParties: MatchParty[];
}

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
}
