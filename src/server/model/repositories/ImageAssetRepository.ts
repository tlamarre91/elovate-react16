import fs from 'fs';
import path from 'path';
import appRoot from 'app-root-path';
import jdenticon from 'jdenticon';
import winston from 'winston';

import * as Orm from 'typeorm';

import * as Dto from '~shared/data-transfer-objects';
import { BaseRepository } from './BaseRepository';
import { ImageAsset } from '../entities';

const ASSET_DIR = process.env.ELOVATE_STATIC_DIR || path.join(appRoot.path, 'dist', 'public');

@Orm.EntityRepository(ImageAsset)
export class ImageAssetRepository extends BaseRepository<ImageAsset> {
    findOneFromQuery(query: string): Promise<ImageAsset> {
        throw new Error('Method not implemented.');
    }

    createFromDto(dto: Dto.ImageAssetDto): Promise<ImageAsset> {
        throw new Error('Method not implemented.');
    }

    static identiconDir = path.join('img', 'identicons');

    static identiconUri(token: string, size: number): string {
        return `${this.identiconDir}/${token}-${size}x${size}.png`;
    }

    async generateIdenticon(token: string, size: number = 50): Promise<ImageAsset> {
        const png = jdenticon.toPng(token, size);
        const uri = ImageAssetRepository.identiconUri(token, size);
        try {
            fs.mkdirSync(path.join(ASSET_DIR, ImageAssetRepository.identiconDir));
        } catch (e) {
        // woops TODO
        }

        fs.writeFileSync(path.join(ASSET_DIR, uri), png); // TODO: async!
        const newAsset = new ImageAsset();
        newAsset.uri = uri;
        newAsset.height = size;
        newAsset.width = size;
        return this.save(newAsset);
    }

    async getIdenticon(token: string, size: number = 50): Promise<ImageAsset> {
        if (size > 256) {
            throw new Error('Cannot handle identicon larger than 256 pixels');
        }

        return this.findOneOrFail({ // TODO: woops, wrong. findOne returns null if there isn't one. that's not an error
            uri: ImageAssetRepository.identiconUri(token, size),
        })
            .then((asset) => asset)
            .catch((err) => this.generateIdenticon(token, size));
    }
}
