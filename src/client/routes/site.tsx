import React from "react";
import ReactDOM, {
    render,
    createPortal
} from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    NavLink,
    Link
} from "react-router-dom";

import * as Api from "~shared/api";
import * as Dto from "~shared/model/data-transfer-objects";
import { elmt } from "~client/util";
import { log } from "~shared/log";

import {
    AdminRouter,
    UserRouter,
    GroupRouter
} from "~client/routes";

import { UserCard } from "~client/components/cards";
import { LoginForm } from "~client/components/LoginForm";
import { LoggedInUserWidget } from "~client/components/LoggedInUserWidget";

export interface SiteRouterProps {
    navElement: HTMLElement;
    loggedInUserWidgetElement: HTMLElement;
}

export const SiteRouter: React.FC<SiteRouterProps> = (props) => {
    const [loggedInUser, setLoggedInUser] = React.useState<Dto.UserDto>(null);

    return <Router>
        <>
            {
                createPortal(<nav id="siteNav">
                    <NavLink to="/groups">Dashboard</NavLink>
                    <NavLink to="/users" >Users</NavLink>
                    <NavLink to="/admin" >Admin</NavLink>
                </nav>, props.navElement)
            }
            {
                createPortal(<LoggedInUserWidget subscribers={ [setLoggedInUser] } />, props.loggedInUserWidgetElement)
            }
        </>
        <Switch>
            <Route path="/users">
                <UserRouter />
            </Route>
            <Route path="/groups">
                <GroupRouter />
            </Route>
            <Route path="/login">
                <LoginForm values={{ username: "", password: "", "auth-method": "basic" }}/>
            </Route>
            <Route path="/admin">
                <AdminRouter />
            </Route>
        </Switch>
    </Router>
}
