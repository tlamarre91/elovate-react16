import { Request, Response, NextFunction } from "express";
import * as Orm from "typeorm";

import { log } from "~server/log";
import { Resource } from "~shared/model/Resource";
import * as Repository from "~shared/model/repositories";

//function init(repo: Repository.BaseRepository<T extends Resource>) {
export default function<T extends Resource>(repo: Repository.BaseRepository<T>) {
    return (req: Request, res: Response, next: NextFunction) => {
        log.info("autoquery middlware not implemented");
        next();
    }
}
