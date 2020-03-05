import * as Orm from "typeorm";

import * as Entity from "../entities";

@Orm.EntityRepository(Entity.Party)
export class CalendarEventRepository extends Orm.Repository<Entity.CalendarEvent> {
}
