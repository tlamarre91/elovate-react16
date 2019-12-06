import { Store } from "express-session";
import {
    getRepository,
    Repository,
    Entity
    EntityRepository,
    Index,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    LessThan
} from "typeorm";

import {
    User
} from "./User";

export interface Data {
    [key: string]: string;
}

@Entity()
export class Session {
    @Column()
    id: string;

    @Column()
    expiresAt: number;

    @ManyToOne(type => User, user => user.loginSessions)
    loggedInUser: User;

    @Column({ type: "jsonb" })
    data: Data;
}

//@EntityRepository(Session)
//export class SessionRepository extends Repository<Session> {
//}

export interface SessionStoreOpts {
    repository: SessionRepository;
    ttl: number;
    expirationInterval: number;
    clearExpired: boolean;
}

export class SessionStore extends Store {
    private readonly repository: Repository<Session>;
    private readonly ttl: number;
    private readonly expirationInterval: number;
    private expirationIntervalId: number;

    constructor(opts: SessionStoreOpts) {
        super();
        this.repository = opts.repository;
        this.ttl = opts.ttl;
        this.expirationInterval = opts.expirationInterval;
        if (opts.clearExpired) {
            this.setExpirationInterval(this.expirationInterval);
        }
    }

    clearExpiredSessions = (callback?: (error: any) => void) => {
        const timestamp = Math.round(new Date().getTime() / 1000);
        this.repository
            .delete({ expiresAt: LessThan(timestamp) })
            .then(() => {
                if (callback) callback(null);
            })
            .catch((err: any) => {
                if (callback) callback(err);
            });
    }

    setExpirationInterval = (time: number) => {
        if (this.expirationIntervalId) {
            window.clearInterval(this.expirationIntervalId);
        }

        this.expirationIntervalId = window.setInterval(this.clearExpiredSessions, time);
    }

    // Store API methods:
    all = (cb: (err: any, result?: any) => void): void => {
        this.repository
            .find()
            .then((sessions: Session[]) => sessions
    }
}
