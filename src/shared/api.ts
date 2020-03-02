import winston from "winston";

import * as Entity from "~shared/model/entities";
let log: winston.Logger;
export function setLogger(logger: winston.Logger) {
    log = logger;
}

export const API_ROOT = "/api/v1"

export enum Resource {
    User = "users",
    Group = "groups",
    Match = "matches"
}

export class Get<Receive> {
    url: string;
    origin: string;

    constructor(origin: string, resource: Resource, query: string) {
        this.url = `${API_ROOT}/${resource}/${query}`;
        this.origin = origin;
    }

    async execute(): Promise<Response<Receive>> {
        log?.info("running a get (TODO: remove. just testing)");
        let fetchParams: any = {
            method: "GET",
            credentials: "same-origin",
            headers: {
                Accept: "application/json",
            }
        };

        return fetch(this.url, fetchParams)
            .then(response => response.json())
            .then(obj => obj as Response<Receive>); // TODO: not enough to just assert type. need validation.
    }
}

export class Post<Send, Receive> {
    url: string;
    origin: string;
    body: string;

    constructor(origin: string, resource: Resource, obj: Send) {
        this.url = `${API_ROOT}/${resource}`; // TODO: client-side sanitize?
        this.origin = origin;
        this.body = JSON.stringify({
            origin,
            targetResource: resource,
            data: obj
        });
    }

    async execute(): Promise<Response<Receive>> {
        let fetchParams: any = {
            method: "POST",
            credentials: "same-origin",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: this.body
        };

        return fetch(this.url, fetchParams)
            .then(response => response.json())
            .then(obj => obj as Response<Receive>);
    }
}

export class Response<T> {
    success: boolean;
    error: string | null;
    data: T | null;

    constructor(success: boolean, error?: string, data?: T) {
        this.success = success;
        this.error = error;
        this.data = data;
    }
}

//function queryString(keyVals: [string, string][]): string {
//    // TODO: ensure reserved symbols are escaped
//    const str: string = '?' + keyVals.map(pair => `${ pair[0] }=${ pair[1] }`).join("&");
//    return str;
//}
//
//interface UrlQuery {
//    toQueryStr(): string;
//}
//
//export enum SearchType {
//    Exact = "exact",
//    ContainsAll = "containsAll",
//    ContainsAny = "containsAny",
//}
//
//export class UserSearchParams implements UrlQuery {
//    // TODO: implement isSubset() for client-side checking.
//    // eg: if newParams.isSubset(lastParams) then don't hit API - filter results in client
//    searchProps: Partial<Entity.User>;
//    searchType: SearchType;
//
//    constructor(searchProps: Partial<Entity.User>, searchType: SearchType) {
//        this.searchProps = searchProps;
//        this.searchType = searchType;
//    }
//
//    static fromQuery(query: any): UserSearchParams {
//        // TODO: Is it ok that this totally shits with a malformed query? validate elsewhere, i guess
//        let props: Partial<Entity.User> = { ... query }; // TODO: should query.searchType get stuck into props too?
//        let searchType: SearchType = query["searchType"];
//        return new UserSearchParams(props, searchType);
//    }
//
//    toQueryStr(): string {
//        let pairs: [string, string][] = [];
//
//        for (let k in this.searchProps) {
//            pairs.push([k, this.searchProps[k as keyof Entity.User].toString()]);
//        }
//
//        pairs.push(["searchType", this.searchType]);
//        return queryString(pairs);
//    }
//}
