import winston from "winston";

import { log } from "~shared/log";
import { BaseDto } from "~shared/data-transfer-objects";


export const API_ROOT = "/api/v1"

export enum Resource {
    WhoAmI = "whoami",
    Authentication = "auth",
    Deauthentication = "deauth",
    User = "users",
    Group = "groups",
    Match = "matches"
}

export class Get<Receive> {
    url: string;
    origin: string;

    constructor(resource: Resource, query?: string) {
        this.origin = window?.location?.href;
        this.url = `${API_ROOT}/${resource}` + (query ? `/${query}` : "");
        this.origin = origin;
    }

    async execute(): Promise<Response<Receive>> {
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

// TODO: i don't need a Send parameter. doesn't seem that i actually need to know anything about it
export class Post<Send, Receive> {
    url: string;
    origin: string;
    body: string;

    constructor(resource: Resource, obj: Send, query?: string) {
        this.url = `${API_ROOT}/${resource}` + (query ? `/${query}` : "");
        this.origin = window?.location?.href;
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

// TODO: factor out common properties between request types
export class Put<Send, Receive> {
    url: string;
    origin: string;
    body: string;

    constructor(resource: Resource, obj: Send, query?: string) {
        this.url = `${API_ROOT}/${resource}` + (query ? `/${query}` : "");
        this.origin = window?.location?.href;
        this.body = JSON.stringify({
            origin,
            targetResource: resource,
            data: obj
        });
    }

    async execute(): Promise<Response<Receive>> {
        let fetchParams: any = {
            method: "PUT",
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
