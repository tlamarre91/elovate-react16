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
import appState from "~client/app-state";

import {
    UserDto
} from "~shared/data-transfer-objects";

import {
    ErrorBoundary as EB,
    LoginDialog,
} from "~client/components";

export interface LoggedInUserWidgetProps {
}

export const LoggedInUserWidget: React.FC<LoggedInUserWidgetProps> = (props) => {
    const { loggedInUser, setLoggedInUser, siteInitialized, setSiteInitialized } = React.useContext(appState);
    const [status, setStatus] = React.useState<string>("");
    const [error, setError] = React.useState<string>("");
    const [loaded, setLoaded] = React.useState<boolean>(false);

    const logout = () => {
        const call = new Api.Get<string>(Api.Resource.Deauthentication);
        call.execute().then(res => {
            if (res.success) {
                setLoggedInUser(null);
                setStatus("logged out")
                setError(null);
                setTimeout(() => { setStatus(null) }, 2000);
            } else {
                setError(res.error);
            }
        });
    }

    React.useEffect(() => {
        try {
            const call = new Api.Get<UserDto>(Api.Resource.WhoAmI);
            call.execute().then(res => {
                if (res.success) {
                    setStatus("");
                    setError("");
                    setLoggedInUser(res.data);
                } else {
                    setLoggedInUser(null);
                    log.warn(`LoggedInUserWidget: ${res.error}`);
                    setStatus(`not logged in`); // TODO: this is not correct. need trello card for "insufficiently robust" code
                    setError(res.error);
                }

                setSiteInitialized(true);
            });
        } catch (err) {
            log.warn(`LoggedInUserWidget: ${err}`);
        }
    }, []);

    const history = useHistory();

    if (! siteInitialized) {
        return null;
    } else if (! loggedInUser) {
        const promptStyle: React.CSSProperties = {
            color: "rgb(240, 240, 240)",
            fontWeight: "bold"
        }

        const loginPopover =  <BP.Popover
            position="bottom-right"
            usePortal={ false }
            content={ <LoginDialog onUserChange={ setLoggedInUser } /> }
            target={ <BP.Button id="loginButton" style={ promptStyle } tabIndex={ 0 } minimal text="Log in" /> } />

        const registerLink = ( <BP.Button style={ promptStyle } tabIndex={ 0 } minimal text="Register"
            onClick={ () => history.push("/register") } /> )

        return <EB>
            { loginPopover }
            { registerLink }
        </EB>
    } else {
        const popoverContent = <div className="loggedInUserWidgetPopover">
            <BP.Menu>
                <BP.MenuItem onClick={ () => history.push("/user/profile") } text="Profile" />
                <BP.MenuItem onClick={ () => history.push("/messages") } text="Messages" />
                <BP.MenuItem onClick={ () => history.push("/settings") } icon="settings" text="Settings" />
                <BP.MenuItem onClick={ () => history.push("/help") } icon="help" text="Help"/>
                <BP.Menu.Divider />
                <BP.MenuItem id="logoutButton" onClick={ logout } tabIndex={ 0 } icon="log-out" text="Log out" />
            </BP.Menu>
        </div>

        const target = (
            <a className="target" tabIndex={ 0 } role="button">
                <div id="loggedInUserTag" className="displayTag">
                    <span className="displayName">{ loggedInUser.displayName || loggedInUser.username }</span>
                    <BP.Icon icon="user" iconSize={ 30 } color={ "rgb(240, 240, 240)" } />
                </div>
            </a>
        )

        return <EB>
            <BP.Popover
                position="bottom-right"
                usePortal={ false }
                content={ popoverContent }
                target={ target } />
        </EB>
    }
}
