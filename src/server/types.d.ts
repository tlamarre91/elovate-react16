// extend Express.Request type to include properties set by our middleware

declare namespace Express {
    export interface Request {
        user: import("~shared/model/entities").User;
        groupMemberships: import("~shared/model/entities").GroupUser[];
        resource: import("~shared/model/Resource").Resource;
    }
}
