import { Store } from "express-session";
import {
    getRepository,
    Repository,
    Entity,
    EntityRepository,
    Index,
    Column,
    PrimaryColumn,
    PrimaryGeneratedColumn,
    ManyToOne,
    LessThan
} from "typeorm";

import { log } from "../log";

@Entity()
export class Session {
    @PrimaryColumn()
    sid: string;

    @Column()
    expiresAt: number;

    @Column({ type: "jsonb" })
    data: any;
}

@EntityRepository(Session)
export class SessionRepository extends Repository<Session> {
     async getUserSessions(userId: number): Promise<Session[]> {
         return [];
     }
}

export interface SessionStoreOpts {
    repository: SessionRepository;
    ttl: number;
    expirationInterval: number;
    clearExpired: boolean;
}

export class SessionStore extends Store {
    private readonly repository: SessionRepository;
    private readonly ttl: number;
    private readonly expirationInterval: number;
    private expirationIntervalId: NodeJS.Timeout;

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
    };

    setExpirationInterval = (time: number) => {
        try {
            if (this.expirationIntervalId) {
                global.clearInterval(this.expirationIntervalId);
            }

            this.expirationIntervalId = global.setInterval(this.clearExpiredSessions, time);
        } catch (e) {
            log.error(e);
            throw e;
        }
    };

    newExpireTime(ttl?: number) {
        return Math.floor(new Date().getTime() / 1000) + (ttl ?? this.ttl);
    }

    // session.Store API methods
    all = (cb: (err: any, result?: any) => void) => {
        this.repository
            .find()
            .then(sessions => sessions.map(s => cb(null, s.data)))
            .catch(err => cb(err));
    };

    destroy = (sid: string, cb: (err?: any) => void) => {
        this.repository
            .delete({ sid })
            .then(() => cb())
            .catch(err => cb(err));
    };

    clear = (cb: (err?: any) => void) => {
        this.repository
            .clear()
            .then(() => cb())
            .catch(err => cb(err));
    };

    length = (cb: (err: any, len?: number) => void) => {
        this.repository
            .count()
            .then(n => cb(null, n))
            .catch(err => cb(err));
    };

    get = (sid: string, cb: (err: any, session?: any) => void) => {
        this.repository
            .findOne({ sid })
            .then(s => cb(null, s?.data)) // TODO: is this the right way to use optional access?
            .catch(err => cb(err));
    };


    set = (sid: string, data: any, cb?: (error?: any) => void) => {
        this.repository
            .save({ sid, expiresAt: this.newExpireTime(data?.ttl), data })
            .then(() => cb())
            .catch(err => cb(err));
    };

    touch = (sid: string, data: any, cb?: (error?: any) => void) => {
        this.repository
            .update(sid, { expiresAt: this.newExpireTime(data?.ttl) })
            .then(() => cb())
            .catch(err => cb(err));
    };
}
