import * as Orm from "typeorm";

import * as Entity from "../entities";

@Orm.EntityRepository(Entity.Notification)
export class NotificationRepository extends Orm.Repository<Entity.Notification> {
}
