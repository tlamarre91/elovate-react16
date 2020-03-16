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
import { UserDto } from "~shared/model/data-transfer-objects";

import {
    AdminRouter,
    UserRouter,
    GroupRouter,
    DashboardRouter
} from "~client/routes";

import { UserCard } from "~client/components/cards";
import { LoginDialog } from "~client/components/LoginDialog";
import { LoggedInUserWidget } from "~client/components/LoggedInUserWidget";
import { UserCreateForm } from "~client/components/UserCreateForm";

export interface SiteRouterProps {
    navElement: HTMLElement;
    loggedInUserWidgetElement: HTMLElement;
}

export const SiteRouter: React.FC<SiteRouterProps> = (props) => {
    const [loggedInUser, setLoggedInUser] = React.useState<Dto.UserDto>(null);
    const handleLoggedInUserChange = (user: Dto.UserDto) => {
        setLoggedInUser(user);
    };

    return <Router>
        <>
            {
                createPortal(<nav id="appBarNav">
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/user" >Users</NavLink>
                    <NavLink to="/admin" >Admin</NavLink>
                </nav>, props.navElement)
            }
            {
                createPortal(<LoggedInUserWidget
                    user={ loggedInUser }
                    onChange={ handleLoggedInUserChange }
                />, props.loggedInUserWidgetElement)
            }
        </>
        <Switch>
            <Route path="/login">
                <LoginDialog 
                    onChange={ handleLoggedInUserChange }
                    redirect="/"
                />
            </Route>
            <Route path="/register">
                <UserCreateForm registration />
            </Route>
            <Route path="/dashboard">
                <DashboardRouter />
            </Route>
            <Route path="/user">
                <UserRouter />
            </Route>
            <Route path="/admin">
                <AdminRouter />
            </Route>
        </Switch>
    </Router>
}
