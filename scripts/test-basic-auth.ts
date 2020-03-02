import config from "./config.json";
import axios from "axios";

console.log(process.argv);

axios.post(`http://${config.host}:${config.port}/api/v1/auth?redirect=/`, {
    "auth-method": "basic",
    username: process.argv[2],
    password: process.argv[3]
}).then(res => {
    console.log(res.data);
}).catch(err => {
    console.log(err.response.data);
});
