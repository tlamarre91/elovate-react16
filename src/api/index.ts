import winston from "winston";
/**
 * Classes, interfaces, and values shared between client and server for typesafe API communication
 */

// TODO: get a function in here to take a logger and register it to be available to rest of module
// TODO: test the following. lol

let log: winston.Logger;
export function setLogger(logger: winston.Logger) {
    log = logger;
}

/**
 * Base URLs for API endpoints
 */

import { EntityProps, UserProps, GroupProps, GameProps, MatchProps } from "./props";
export { EntityProps, UserProps, GroupProps, GameProps, MatchProps };

export enum Endpoint {
    SearchUsers = "/searchUsers",
    AddUser = "/addUser"
}

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

export interface Receiver<T> {
    id: string;
    data(obj: T): void;
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
    searchProps: Partial<UserProps>;
    searchType: SearchType;

    constructor(searchProps: Partial<UserProps>, searchType: SearchType) {
        this.searchProps = searchProps;
        this.searchType = searchType;
    }

    static fromQuery(query: any): UserSearchParams {
        // TODO: Is it ok that this totally shits with a malformed query? validate elsewhere, i guess
        let props: Partial<UserProps> = { ... query }; // TODO: does query.searchType get stuck into props too?
        let searchType: SearchType = query["searchType"];
        return new UserSearchParams(props, searchType);
    }

    toQueryStr(): string {
        let pairs: [string, string][] = [];

        for (let k in this.searchProps) {
            pairs.push([k, this.searchProps[k as keyof UserProps].toString()]);
        }

        pairs.push(["searchType", this.searchType]);
        return queryString(pairs);
    }
}
