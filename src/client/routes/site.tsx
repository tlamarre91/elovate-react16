import React from "react";
import ReactDOM, {
    render,
    createPortal
} from "react-dom";
import { Helmet } from "react-helmet";
import {
    BrowserRouter as Router,
    Link,
    NavLink,
    Route,
    Switch,
    useHistory
} from "react-router-dom";

import * as Api from "~shared/api";
import * as Dto from "~shared/data-transfer-objects";
import { log } from "~shared/log";

import context from "~client/context";

import {
    AdminRouter,
    UserRouter,
    GroupRouter,
} from "~client/routes";

import {
    Dashboard,
    UserRegistrationPage,
} from "~client/pages";

import {
    GroupProfile,
    LoginDialog,
    LoggedInUserWidget,
    UserCreateForm,
} from "~client/components";

export const SiteRouter: React.FC<{ navElement: HTMLElement, loggedInUserWidgetElement: HTMLElement}> = (props) => {
    const [loggedInUser, setLoggedInUser] = React.useState<Dto.UserDto>();
    return (
        <context.Provider value={{ loggedInUser, setLoggedInUser }}>
            <Helmet defaultTitle="elovate"
                titleTemplate="%s - elovate" >
            </Helmet>
            <Router>
                <>
                    {
                        createPortal(<nav id="appBarNav">
                            <NavLink to="/dashboard">Dashboard</NavLink>
                            <NavLink to="/admin" >Admin</NavLink>
                            <NavLink to="/user" >Users</NavLink>
                            <NavLink to="/group" >Groups</NavLink>
                        </nav>, props.navElement)
                    }
                    {
                        createPortal(<LoggedInUserWidget />, props.loggedInUserWidgetElement)
                    }
                </>
                <Switch>
                    <Route path="/login">
                        <LoginDialog onUserChange={ setLoggedInUser } redirect="/" />
                    </Route>
                    <Route path="/register">
                        { /* loggedInUser
                            ? <div style={{ padding: "20px" }}>
                                You are already logged in. 😀 To create users go to ______
                            </div>
                            :  <UserRegistrationPage onUserChange={ setLoggedInUser } /> 
                           */ }
                        <UserRegistrationPage />
                    </Route>
                    <Route path="/dashboard">
                        <Dashboard />
                    </Route>
                    <Route path="/admin">
                        <AdminRouter />
                    </Route>
                    <Route path="/user">
                        <UserRouter />
                    </Route>
                    <Route path="/group">
                        <GroupRouter />
                    </Route>
                    <Route>
                        page not found
                    </Route>
                </Switch>
            </Router>
        </context.Provider>
    )
}
