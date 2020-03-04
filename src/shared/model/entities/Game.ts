import * as Orm from "typeorm";
import * as Entity from ".";
import { Resource } from "../Resource";

@Orm.Entity()
export class Game extends Resource {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column({ default: () => "NOW()" })
    dateCreated: Date;

    @Orm.Column()
    name: string;

    @Orm.OneToMany(() => Entity.Match, match => match.game)
    matches: Entity.Match[];
}
