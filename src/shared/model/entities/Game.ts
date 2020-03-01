import * as Orm from "typeorm";

import { Match } from ".";

@Orm.Entity()
export class Game {
    @Orm.PrimaryGeneratedColumn()
    id: number;

    @Orm.Column({ default: () => "NOW()" })
    dateCreated: Date;

    @Orm.Column()
    name: string;

    @Orm.OneToMany(type => Match, match => match.game)
    matches: Match[];
}
