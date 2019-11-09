import winston from "winston";

const log: winston.Logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

log.info("here i am!!!");
var i = 0;
const elmt = document.getElementById("timeContainer");

setInterval(() => {
    i += 1;
    elmt.innerText = `i: ${i}`;
}, 1000);
