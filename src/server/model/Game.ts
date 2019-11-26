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

import { Match } from "./Match";

@Entity()
export class Game implements Api.MapsTo<Api.GameProps> {
    toProps() {
        return { ... this };
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => Match, match => match.game)
    matches: Match[];
}

@EntityRepository(Game)
export class GameRepository extends Repository<Game> {
}
