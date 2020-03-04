import * as Orm from "typeorm";
import * as Entity from ".";
import { Resource } from "../Resource";

@Orm.Entity()
export class League extends Resource {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    //@Orm.OneToMany(() => Entity.MatchParty)
}

