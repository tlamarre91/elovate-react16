import { createConnection } from "typeorm";

export async function connectDb() {
    try {
        const conn = await createConnection();
        return conn;
    } catch (err) {
        throw err;
    }
}
