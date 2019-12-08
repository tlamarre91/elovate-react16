import * as React from "react";
import { render } from "react-dom";
import { Button } from "@material-ui/core";

import { log } from "./log";
import * as Api from "../api";

interface AdminControlsProps {
    log?: string[];
}

interface AdminControlsState {
    log: string[];
}

export class AdminControlsComponent extends React.Component<AdminControlsProps, AdminControlsState> {
    constructor(props: AdminControlsProps) {
    super(props);
        this.state = {
            log: [],
            ... props
        };
    }

    log = (str: string) => this.setState(prevState => {
        return { log: prevState.log.concat(str) };
    });

    private newUserCall = () => {
        const baseStr = "user_" + Math.floor(Math.random() * 100000);
        const newProps: Partial<Api.UserProps> = {
            username: baseStr,
            displayName: baseStr + " display name",
            email: baseStr + "@test.com"
        };

        const call = new Api.ApiPost<Partial<Api.UserProps>, Api.UserProps>(window.location.href, Api.Endpoint.AddUser, newProps);
        call.execute().then(res => {
            if (! res.success) {
                const err = res.error;
                log.error(err);
                this.log(`error: ${ JSON.stringify(err) }`);
            } else {
                this.log(`added user: ${ baseStr }`);
            }
        }).catch(err => {
            log.error(err);
            this.log("error: SERIOUS GOOFS");
        });
    };

    render() {
        const log = this.state.log;
        const logElems = log.slice(log.length - 10).map(str => <div className="adminLogEntry">{ str }</div>);

        return (
            <div className="adminControls">
                <div className="adminLog">
                    {logElems}
                </div>
                <Button variant="contained" color="primary">
                    add user
                </Button>
                <Button variant="contained" color="secondary">
                    poop farts
                </Button>
            </div>
        )
    }
}
