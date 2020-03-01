import * as Orm from "typeorm";
import { Game } from "../entities";

@Orm.EntityRepository(Game)
export class GameRepository extends Orm.Repository<Game> {
}
