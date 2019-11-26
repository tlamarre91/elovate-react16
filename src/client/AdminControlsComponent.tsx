import * as React from "react";
import { render } from "react-dom";

import { log } from "./log";

import * as Api from "../api";

interface AdminControlsProps {
}

interface AdminControlsState {
    status: string;
}

export class AdminControlsComponent extends React.Component<AdminControlsProps, AdminControlsState> {
    constructor(props: AdminControlsProps) {
        super(props);
        this.state = {
            status: "loaded"
        };
    }

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
                const newState = { status: `error: ${ err }` };
                this.setState(newState);
            } else {
                this.setState({ status: `added user: ${ baseStr }` });
            }
        }).catch(err => {
            log.error(err);
            this.setState({ status: "SERIOS GOOFS" });
        });
    }

    render() {
        return <div className="adminControls">
            <div className="adminStatusMsg">{ this.state.status }</div>
            <button onClick={ this.newUserCall }>add random user</button>
        </div>;
    }
}
