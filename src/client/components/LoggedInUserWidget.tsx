import React from "react";
import {
    Link
} from "react-router-dom";

import * as Api from "~shared/api";
import { log } from "~shared/log";
import { UserDto } from "~shared/model/data-transfer-objects";

export interface LoggedInUserWidgetProps {
    subscribers: ((user: UserDto) => void)[];
}

export const LoggedInUserWidget: React.FC<LoggedInUserWidgetProps> = (props) => {
    const [user, setUser] = React.useState<UserDto>(null);
    const subscribers = [setUser, ... props.subscribers];
    const [status, setStatus] = React.useState<string>();
    const [error, setError] = React.useState<string>();

    log.info("aaahhhhh");
    React.useEffect(() => {
        try {
            const call = new Api.Get<UserDto>(window.location.href, Api.Resource.WhoAmI);
            log.info(`1: ${call.url}`);
            call.execute().then(res => {
                if (res.success) {
                    setStatus(null);
                    setError(null);
                    subscribers.forEach(c => c(res.data));
                } else {
                    subscribers.forEach(c => c(res.data));
                    log.warn(`LoggedInUserWidget: ${res.error}`);
                    setStatus(`not logged in`);
                    setError(res.error);
                }
            });
        } catch (err) {
            log.warn(`LoggedInUserWidget: ${err}`);
        }
    }, []);

    return user
        ? <div className="loggedInUserWidget">
            { status
                ? <div className="status">{ status }</div>
                : null }
                <div className="username">{ user.username }</div>
                <a className="button" href="/api/v1/deauth?redirect=/">Log out</a>
            </div>
        : <Link to="/login" className="button">Log in</Link>
}
