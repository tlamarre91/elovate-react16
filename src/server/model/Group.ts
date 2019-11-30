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

import { MappedEntity } from "./MappedEntity";
import { User } from "./User";

@Entity()
export class Group extends MappedEntity<Api.GroupProps> {
    toProps() {
        return { ... this };
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
}

@EntityRepository(Group)
export class GroupRepository extends Repository<Group> {
}
