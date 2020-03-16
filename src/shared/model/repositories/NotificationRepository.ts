import * as Orm from "typeorm";

import { BaseRepository } from "./BaseRepository";
import { Notification } from "~shared/model/entities/Notification";
import * as Dto from "../data-transfer-objects";

@Orm.EntityRepository(Notification)
export class NotificationRepository extends BaseRepository<Notification> {
    findOneFromQuery(query: string): Promise<Notification> {
        throw new Error("Method not implemented.");
    }

    createFromDto(dto: Dto.NotificationDto): Promise<Notification> {
        throw new Error("Method not implemented.");
    }

}
