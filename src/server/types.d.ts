// extend Express.Request type to include properties set by our middleware

declare namespace Express {
    export interface Request {
        user: import("~server/model/entities").User;
        groupMemberships: import("~server/model/entities").GroupUser[];
    }
}
