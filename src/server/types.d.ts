// extend Express.Request type to include properties set by our middleware

declare namespace Express {
    export interface Request {
        user: import("~shared/model/entities/User").User;
        groupMemberships: import("~shared/model/entities/GroupUser").GroupUser[];
    }
}
