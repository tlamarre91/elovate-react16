import React from "react";
import * as BP from "@blueprintjs/core";
import {
    Route,
    Switch,
    Link,
    useRouteMatch,
    useHistory
} from "react-router-dom";

import * as Api from "~shared/api";
import { log } from "~shared/log";
import { UserDto } from "~shared/model/data-transfer-objects";
import { LoginDialog } from "~client/components/LoginDialog";
import { UserCreateForm } from "~client/components/UserCreateForm";

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
        const call = new Api.Get<string>(Api.Resource.Deauthentication);
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
            const call = new Api.Get<UserDto>(Api.Resource.WhoAmI);
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

    const history = useHistory();

    if (! loaded) {
        return null;
    } else if (! props.user) {
        const promptStyle: React.CSSProperties = {
            color: "rgb(240, 240, 240)",
            fontWeight: "bold"
        }

        const loginPopover =  <BP.Popover
            position="bottom-right"
            usePortal={ false }
            content={ <LoginDialog onChange={ props.onChange } /> }
            target={ <BP.Button style={ promptStyle } tabIndex={ 0 } minimal text="Log in" /> } />

        const registerLink = <BP.Button style={ promptStyle } tabIndex={ 0 } minimal text="Register"
            onClick={ () => history.push("/register") } />

        return <>
            { loginPopover }
            { registerLink }
        </>
    } else {
        const popoverContent = <div className="loggedInUserWidgetPopover">
            <BP.Menu>
                <BP.MenuItem onClick={ () => history.push("/user/profile") } text="Profile" />
                <BP.MenuItem onClick={ () => history.push("/messages") } text="Messages" />
                <BP.MenuItem onClick={ () => history.push("/settings") } icon="settings" text="Settings" />
                <BP.MenuItem onClick={ () => history.push("/help") } icon="help" text="Help"/>
                <BP.Menu.Divider />
                <BP.MenuItem onClick={ logout } tabIndex={ 0 } icon="log-out" text="Log out" />
            </BP.Menu>
        </div>

        const target = (
            <a className="target" tabIndex={ 0 } role="button">
                <div className="displayTag">
                    <span className="displayName">{ props.user.displayName }</span>
                    <BP.Icon icon="user" iconSize={ 30 } color={ "rgb(240, 240, 240)" } />
                </div>
            </a>
        )

        return <BP.Popover
            position="bottom-right"
            usePortal={ false }
            content={ popoverContent }
            target={ target } />
    }
}
