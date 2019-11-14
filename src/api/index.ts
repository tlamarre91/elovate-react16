/**
 * Classes, interfaces, and values shared between client and server for typesafe API communication
 */

// TODO: get a function in here to take a logger and register it to be available to rest of module

/**
 * Base URLs for API endpoints
 */
export enum Endpoint {
    SearchUsers = "/searchUsers",
    AddUser = "/blahblahblah"
}

export class ApiGet<Receive> {
    url: string;
    origin: string;

    constructor(origin: string, endpoint: Endpoint) {
        this.url = `/api${ endpoint }`;
        this.origin = origin;
    }

    async execute(): Promise<ApiResponse<Receive>> {
        let fetchParams: any = {
            method: "GET",
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
        // log.info(`executing API query: ${ JSON.stringify(this) }`);
        let fetchParams: any = {
            method: "GET",
            headers: {
                Accept: "application/json",
            }
        };

        return fetch(this.url, fetchParams)
            .then(response => response.json())
            .then(obj => obj as ApiResponse<Receive>);
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

/**
 * Properties representing basic information about a user
 */
export interface UserProps {
    username?: string | null;
    displayName?: string | null;
    email?: string | null;
}

//export interface UserPropsList extends ApiObj {
//    users: UserProps[];
//}

function queryString(... keyVals: [string, string][]): string {
    // TODO: ensure reserved symbols are escaped
    const str: string = '?' + keyVals.map(pair => `${ pair[0] }=${ pair[1] }`).join("&");
    console.log(`made query string: ${ str }`);
    return str;
}


interface UrlQuery {
    toQueryStr(): string;
}

export class UserSearchParams implements UrlQuery {
    field: "username" | "displayName" | "email";
    match: "exact" | "contains";
    value: string;

    constructor(field: "username" | "displayName" | "email", match: "exact" | "contains", value: string) {
        this.match = match;
        this.field = field;
        this.value = value;
    }

    toQueryStr() {
        return queryString(["match", this.match], ["field", this.field], ["value", this.value]);
    }
}
