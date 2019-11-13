import * as React from "react";
import { render } from "react-dom";
import winston from "winston";

class Counter extends React.Component {
    state = {
        count: 1,
        user: ""
    };

    inc = () => {
        this.setState({
            count: (this.state.count * 2)
        });
    };

    dec = () => {
        this.setState({
            count: (this.state.count / 2)
        });
    };

    submitRandomUser = () => {
        fetch("/addUser", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username: `user_${Math.floor(Math.random() * 1000)}` })
        });
    };

    submitRandomMatch = () => {
        fetch("/addMatch", {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name: `match_${Math.floor(Math.random() * 1000)}` })
        });
    };

    getRandomUser = () => {
        fetch("/randomUser", {
        }).then(res => res.json()).then(json => {
            this.setState({
                user: json["user"]["username"]
            });
        });
    }

    render () {
        return (
            <div>
                <h1>{this.state.count}</h1>
                <p>{this.state.user}</p>
                <button onClick={this.inc}>Double</button>
                <button onClick={this.dec}>Half</button>
                <button onClick={this.submitRandomUser}>Add random user</button>
                <button onClick={this.submitRandomMatch}>Add random match</button>
                <button onClick={this.getRandomUser}>Get random user</button>
            </div>
        );
    }
}

const log: winston.Logger = winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
        new winston.transports.Console({
            format: winston.format.simple()
        })
    ]
});

log.info("here i am dude!!!!!!!!");

render(<Counter />, document.getElementById("container"));
