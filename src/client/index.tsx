import React from "react";
import { render } from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import * as Api from "~shared/api";
import { elmt } from "~client/util";
import { log } from "~shared/log";

import { UserCard } from "~client/components/cards";
import { LoginForm } from "~client/components/LoginForm";
import { AdminRouter, UserRouter } from "~client/routes";
import { NavHeader, NavHeaderProps } from "~client/components";

const contentRouter = <div className="content">
    <Router>
        <Switch>
            <Route path="/users">
                <UserRouter />
            </Route>
            <Route path="/hey">
                <div>HEY!</div>
            </Route>
            <Route path="/login">
                <LoginForm values={{
                    username: "",
                        password: "", 
                        "auth-method": "basic"
                }}/>
            </Route>
            <Route path="/admin">
                <AdminRouter />
            </Route>
        </Switch>
    </Router>
</div>

const navProps: NavHeaderProps = {
    links: [
        { url: "/", text: "Home" },
        { url: "/groups", text: "Groups" },
        { url: "/users", text: "Users" },
        { url: "/admin", text: "Admin" },
    ]
}

const navHeader = NavHeader(navProps);

function main() {
    render(contentRouter, document.getElementById("contentContainer"));
    render(navHeader, document.getElementById("siteNav"));
}

document.addEventListener("DOMContentLoaded", main);
