import "reflect-metadata";
import { createConnection } from "typeorm";

import { log } from "../log";

import * as Model from "../model";

export type DbLog = "query" | "error" | "schema" | "warn" | "info" | "log";

export async function connectDb() {
    try {
        const conn = await createConnection();
        return conn;
    } catch (err) {
        throw err;
    }
}
