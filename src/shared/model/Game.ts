import winston from "winston";

import {
    getRepository,
    Repository,
    EntityRepository,
    Entity,
    BaseEntity,
    Column,
    Index,
    JoinTable,
    PrimaryGeneratedColumn,
    ManyToOne,
    OneToMany,
    ManyToMany
} from "typeorm";

import { Match } from "./Match";

@Entity()
export class Game {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: () => "NOW()" })
    dateCreated: Date;

    @Column()
    name: string;

    @OneToMany(type => Match, match => match.game)
    matches: Match[];
}

@EntityRepository(Game)
export class GameRepository extends Repository<Game> {
}
