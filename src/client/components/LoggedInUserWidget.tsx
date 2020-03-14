import React from "react";
import {
    Route,
    Switch,
    Link,
    useRouteMatch
} from "react-router-dom";

import * as Api from "~shared/api";
import { log } from "~shared/log";
import { UserDto } from "~shared/model/data-transfer-objects";
import { LoginDialog } from "~client/components/LoginDialog";

export interface LoggedInUserWidgetProps {
    user: UserDto;
    onChange: (user: UserDto) => void;
}

export const LoggedInUserWidget: React.FC<LoggedInUserWidgetProps> = (props) => {
    const { path, url } = useRouteMatch();
    log.info(`path: ${path}`);
    const [expanded, setExpanded] = React.useState<boolean>(false);
    const [status, setStatus] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");
    const [loaded, setLoaded] = React.useState<boolean>(false);

    const logout = () => {
        const call = new Api.Get<string>(window.location.href, Api.Resource.Deauthentication);
        call.execute().then(res => {
            if (res.success) {
                props.onChange(null);
                setStatus("logged out")
                setError(null);
                setTimeout(() => { setStatus(null) }, 2000);
            } else {
                setError(res.error);
            }
        });
    }

    React.useEffect(() => {
        log.info(`run @ ${Date.now()}`);
        try {
            const call = new Api.Get<UserDto>(window.location.href, Api.Resource.WhoAmI);
            call.execute().then(res => {
                if (res.success) {
                    setStatus("");
                    setError("");
                    props.onChange(res.data);
                } else {
                    props.onChange(null);
                    log.warn(`LoggedInUserWidget: ${res.error}`);
                    setStatus(`not logged in`);
                    setError(res.error);
                }

                setLoaded(true);
            });
        } catch (err) {
            log.warn(`LoggedInUserWidget: ${err}`);
        }
    }, []);

    if (! loaded) {
        return null;
    } else if (! props.user) {
        log.info(`hey ${path}`);
        return <Link to={ `/login` } className="button">Log in</Link>
    } else {
        return <div className="loggedInUserWidget">
            <div className="username">{ props.user.username }</div>
            <a className="button" onClick={ logout } href="#">Log out</a>
        </div>
    }
}
