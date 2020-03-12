import * as Orm from "typeorm";

import { BaseRepository } from "./BaseRepository";
import * as Entity from "../entities";
import * as Dto from "../data-transfer-objects";

@Orm.EntityRepository(Entity.Notification)
export class NotificationRepository extends BaseRepository<Entity.Notification> {
    findOneFromQuery(query: string): Promise<Entity.Notification> {
        throw new Error("Method not implemented.");
    }

    createFromDto(dto: Dto.NotificationDto): Promise<Entity.Notification> {
        throw new Error("Method not implemented.");
    }

}
