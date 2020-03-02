import config from "./config.json";
import axios from "axios";

axios.post(`http://${config.host}:${config.port}/api/v1/users/setPassword`, {
    username: process.argv[2],
    password: process.argv[3]
}).then(res => console.log(res))
    .catch(err => console.log(err));
