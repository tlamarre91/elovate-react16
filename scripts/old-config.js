const fs = require("fs");

const config = fs.readFileSync("./config.json");
export default JSON.parse(config);
