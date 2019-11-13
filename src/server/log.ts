import appRoot from "app-root-path";
import winston from "winston";

export const log: winston.Logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: `${appRoot}/logs/error.log`, level: "error" }),
        new winston.transports.File({ filename: `${appRoot}/logs/combined.log` })
    ]
});

if (process.env.NODE_ENV !== "production") {
    log.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}
