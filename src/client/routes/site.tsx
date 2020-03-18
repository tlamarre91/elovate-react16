import React from "react";
import DocumentTitle from "react-document-title";
import ReactDOM, {
    render,
    createPortal
} from "react-dom";
import {
    BrowserRouter as Router,
    Link,
    NavLink,
    Route,
    Switch,
    useHistory
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

import {
    UserRegistrationPage
} from "~client/pages";

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

    return <DocumentTitle title="elovate">
        <Router>
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
                <LoginDialog onChange={ handleLoggedInUserChange } redirect="/" />
            </Route>
            <Route path="/register">
                <DocumentTitle title="register">
                    { loggedInUser
                        ? <div style={{ padding: "20px" }}>
                            You are already logged in. 😀 To create users go to ______
                        </div>
                        :  <UserRegistrationPage onChangeLoggedInUser={ handleLoggedInUserChange }/> 
                    }
                </DocumentTitle>
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
</DocumentTitle>
}
