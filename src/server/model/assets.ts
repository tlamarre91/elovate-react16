import fs from "fs";
import path from "path";
import appRoot from "app-root-path";
import jdenticon from "jdenticon";
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

const assetDirName = "assets";
const fsAssetDir = process.env.BASE_ASSET_DIR || path.join(appRoot.path, "dist", "public", assetDirName);

@Entity()
abstract class FileAsset {
    @Column()
    uri: string;
}

@Entity()
export class ImageAsset extends FileAsset {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    height: number;

    @Column({ type: "integer" })
    width: number;
}

@EntityRepository(ImageAsset)
export class ImageAssetRepository extends Repository<ImageAsset> {
    static identiconDir = path.join("img", "identicons");
    static identiconUri(token: string, size: number): string {
         return `${this.identiconDir}/${token}-${size}x${size}.png`;
    }

    generateIdenticon(token: string, size: number = 50): Promise<ImageAsset> {

        const png = jdenticon.toPng(token, size);
        const uri = ImageAssetRepository.identiconUri(token, size);
        try {
            fs.mkdirSync(path.join(fsAssetDir, ImageAssetRepository.identiconDir));
        } catch (e) {
        }

        fs.writeFileSync(path.join(fsAssetDir, uri), png); // TODO: async!
        const newAsset = new ImageAsset();
        newAsset.uri = uri;
        newAsset.height = size;
        newAsset.width = size;
        return this.save(newAsset);
    }

    async getIdenticon(token: string, size: number = 50): Promise<ImageAsset> {
        if (size > 256) {
            throw new Error("Cannot handle identicon larger than 256 pixels");
        }

        return this.findOneOrFail({
            uri: ImageAssetRepository.identiconUri(token, size)
        })
            .then(asset => asset)
            .catch(err => this.generateIdenticon(token, size));
    }
}
