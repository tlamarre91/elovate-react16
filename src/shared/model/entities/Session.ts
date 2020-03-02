//import { Store } from "express-session";
//import * as Orm from "typeorm";
//
//import { log } from "~server/log";
//import { User } from "./User";
//
//@Orm.Entity()
//export class Session {
//    @Orm.PrimaryColumn()
//    sid: string;
//
//    @Orm.Column()
//    expiresAt: number;
//
//    @Orm.Column({ type: "jsonb" })
//    data: any;
//
//    @Orm.ManyToOne(type => User, user => user.loginSessions)
//    user: User;
//}
//
