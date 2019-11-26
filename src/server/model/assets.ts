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

import { Group } from "./Group";
import { Match } from "./Match";


@Entity()
abstract class FileAsset {
    @Column()
    path: string;
}

@Entity()
export class ImageAsset extends FileAsset {
    @PrimaryGeneratedColumn()
    id: number;
}

@EntityRepository(FileAsset)
export class AssetRepository extends Repository<FileAsset> {
}
