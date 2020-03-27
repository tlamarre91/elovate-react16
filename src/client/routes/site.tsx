import React from 'react';
import ReactDOM, { render, createPortal } from 'react-dom';

import ErrorBoundary from 'react-error-boundary';

import { Helmet } from 'react-helmet';

import {
    BrowserRouter as Router,
    Link,
    NavLink,
    Route,
    Switch,
    useHistory,
} from 'react-router-dom';

import * as Api from '~shared/api';
import * as Dto from '~shared/data-transfer-objects';
import { log } from '~shared/log';

import appState from '~client/app-state';

import { AdminRouter, UserRouter, GroupRouter } from '~client/routes';

import { Dashboard, UserRegistrationPage } from '~client/pages';

import {
    AppBarNav,
    LoggedInUserWidget,
    LoginDialog,
    UserCreateForm,
    GroupList,
    ErrorBoundary as EB,
} from '~client/components';

export const SiteRouter: React.FC<{
    navElement: HTMLElement;
    loggedInUserWidgetElement: HTMLElement;
}> = (props) => {
    const [loggedInUser, setLoggedInUser] = React.useState<Dto.UserDto>();
    const [siteInitialized, setSiteInitialized] = React.useState<boolean>(
        false,
    );

    const context = {
        loggedInUser,
        setLoggedInUser,
        siteInitialized,
        setSiteInitialized,
    };

    return (
        <EB>
            <appState.Provider value={context}>
                <Helmet defaultTitle="elovate" titleTemplate="%s - elovate" />
                <Router>
                    <>
                        {createPortal(<AppBarNav />, props.navElement)}
                        {createPortal(
                            <LoggedInUserWidget />,
                            props.loggedInUserWidgetElement,
                        )}
                    </>
                    <Switch>
                        <Route exact path="/">
                            <div className="homepageLinks">
                                <Link to="dashboard">Dashboard</Link>
                                <Link to="admin">Admin</Link>
                                <Link to="users">Users</Link>
                                <Link to="groups">Groups</Link>
                            </div>
                        </Route>
                        <Route path="/login">
                            <LoginDialog
                                onUserChange={setLoggedInUser}
                                redirect="/"
                            />
                        </Route>
                        <Route path="/register">
                            <UserRegistrationPage />
                        </Route>
                        <Route path="/dashboard">
                            <Dashboard />
                        </Route>
                        <Route path="/admin">
                            <AdminRouter />
                        </Route>
                        <Route path="/users">
                            <UserRouter />
                        </Route>
                        <Route path="/groups">
                            <GroupRouter />
                        </Route>
                        <Route>page not found</Route>
                    </Switch>
                </Router>
            </appState.Provider>
        </EB>
    );
};
