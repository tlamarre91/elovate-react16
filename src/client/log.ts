import winston from "winston";

export const log: winston.Logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});


