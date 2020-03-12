import winston from "winston";

let loggerOpts: winston.LoggerOptions;

if (typeof window !== "undefined") {
    // i think we're in a browser
    loggerOpts = {
        level: "info",
        transports: [
            new winston.transports.Console({
                format: winston.format.simple()
            })
        ]
    }
} else {
    // i think we're in node
    const appRoot = import("app-root-path");
    const transports: Array<any> = [
        new winston.transports.File({ filename: `${appRoot}/logs/error.log`, level: "error" }),
        new winston.transports.File({ filename: `${appRoot}/logs/combined.log` })
    ];

    if (process.env.NODE_ENV !== "production") {
        transports.push(new winston.transports.Console({ format: winston.format.simple() }));
    }

    loggerOpts = {
        level: "info",
        format: winston.format.json(),
        transports
    }
}

export const log: winston.Logger = winston.createLogger(loggerOpts);
