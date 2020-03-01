import winston from "winston";

import * as Model from "~shared/model";
let log: winston.Logger;
export function setLogger(logger: winston.Logger) {
    log = logger;
}

/**
 * Base URLs for API endpoints
 */

// hmmm no no no... can enums reference themselves? hmmmmm. see class ENDPOINT below
export enum Endpoint {
    SearchUsers = "/searchUsers",
    AddUser = "/addUser",
    DeleteUser = "/deleteUser"
}

//// Maybe just give up and use strings as endpoints... this might be overkill
//// another alternative: `${enum for entity types}/${enum for method}`
//export type Methods = "search" | "add" | "delete" | "update";
//export class ENDPOINT {
//    static Users(method?: Methods) {
//        const methodStr = method ? `/${method}` : "";
//        return `users${methodStr}`;
//    }
//}

export class ApiGet<Receive> {
    url: string;
    origin: string;

    constructor(origin: string, endpoint: Endpoint) {
        this.url = `/api${ endpoint }`;
        this.origin = origin;
    }

    async execute(): Promise<ApiResponse<Receive>> {
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
            .then(obj => obj as ApiResponse<Receive>); // TODO: not enough to just assert type. need validation.
    }
}

export class ApiQuery<Receive> {
    url: string;
    origin: string;

    constructor(origin: string, endpoint: Endpoint, query: UrlQuery) {
        this.origin = origin;
        this.url = `/api${ endpoint }${ query.toQueryStr() }`;
    }

    async execute(): Promise<ApiResponse<Receive>> {
        let fetchParams: any = {
            method: "GET",
            credentials: "same-origin",
            headers: {
                Accept: "application/json",
            }
        };

        return fetch(this.url, fetchParams)
            .then(response => response.json())
            .then(obj => {
                if (obj["success"] === true) {
                    return obj as ApiResponse<Receive>;
                }
            });
    }
}

/**
 * Representation of a client => server API call via HTTP POST
 * sending a Send instance and expecting a Receive instance
 */
export class ApiPost<Send, Receive> {
    url: string;
    origin: string;
    body: string;

    constructor(origin: string, endpoint: Endpoint, obj: Send) {
        this.url = `/api${ endpoint }`; // TODO: client-side sanitize?
        this.origin = origin;
        this.body = JSON.stringify({
            origin,
            targetEndpoint: endpoint,
            data: obj
        });
    }

    async execute(): Promise<ApiResponse<Receive>> {
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
            .then(obj => obj as ApiResponse<Receive>);
    }
}

/**
 * Representation of a server => client API response, containing an error or an instance of T
 * TODO: maybe change to class - have error | T union type and infer success instead of deciding
 * which property to refer to based on value of success
 */
export interface ApiResponse<T> {
    success: boolean;
    error: string | null;
    data: T | null;
}

export class ApiSuccess<T> implements ApiResponse<T> {
    success: boolean;
    error: string | null;
    data: T | null;
    constructor(data: T) {
        this.success = true;
        this.error = null;
        this.data = data;
    }
}

// NOTE: might need to just make this a method to construct a response. or whatever
export class ApiError<T> implements ApiResponse<T> {
    success: boolean;
    error: string | null;
    data: T | null;
    constructor(errorMsg: string) {
        this.success = false;
        this.error = errorMsg;
        this.data =  null;
    }
}

function queryString(keyVals: [string, string][]): string {
    // TODO: ensure reserved symbols are escaped
    const str: string = '?' + keyVals.map(pair => `${ pair[0] }=${ pair[1] }`).join("&");
    return str;
}

interface UrlQuery {
    toQueryStr(): string;
}

export enum SearchType {
    Exact = "exact",
    ContainsAll = "containsAll",
    ContainsAny = "containsAny",
}

export class UserSearchParams implements UrlQuery {
    // TODO: implement isSubset() for client-side checking.
    // eg: if newParams.isSubset(lastParams) then don't hit API - filter results in client
    searchProps: Partial<Model.User>;
    searchType: SearchType;

    constructor(searchProps: Partial<Model.User>, searchType: SearchType) {
        this.searchProps = searchProps;
        this.searchType = searchType;
    }

    static fromQuery(query: any): UserSearchParams {
        // TODO: Is it ok that this totally shits with a malformed query? validate elsewhere, i guess
        let props: Partial<Model.User> = { ... query }; // TODO: should query.searchType get stuck into props too?
        let searchType: SearchType = query["searchType"];
        return new UserSearchParams(props, searchType);
    }

    toQueryStr(): string {
        let pairs: [string, string][] = [];

        for (let k in this.searchProps) {
            pairs.push([k, this.searchProps[k as keyof Model.User].toString()]);
        }

        pairs.push(["searchType", this.searchType]);
        return queryString(pairs);
    }
}
