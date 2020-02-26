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
import { Match } from "./Match";

@Entity()
export class Game extends MappedEntity<Props.GameProps> {
    toProps() {
        return { ... this };
    }

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
