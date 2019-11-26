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
    OneToOne,
    ManyToOne,
    OneToMany,
    ManyToMany
} from "typeorm";

import * as Api from "../../api";

import { User } from "./User";
import { Game } from "./Game";

export enum MatchVisibility {
    Public = "public",
    Group = "group",
    Hidden = "hidden"
}

@Entity()
export class Match implements Api.MapsTo<Api.MatchProps> {
    toProps() {
        return { ... this };
    }

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => Game, game => game.matches)
    game: Game;

    @Column({
        type: "enum",
        enum: MatchVisibility,
        default: MatchVisibility.Group
    })
    visibility: MatchVisibility;

    @ManyToMany(type => User, user => user.matches)
    @JoinTable()
    players: User[];

    @OneToOne(type => User)
    winner: User;
}

@EntityRepository(Match)
export class MatchRepository extends Repository<Match> {
}
