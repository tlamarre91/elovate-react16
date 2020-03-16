import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    NavLink,
    useParams,
    useRouteMatch,
} from "react-router-dom";

import * as Api from "~shared/api";
import { log } from "~shared/log";
import { UserDto } from "~shared/model/data-transfer-objects";

import { UserAdmin } from "~client/components/UserAdmin";

export const AdminRouter: React.FC = () => {
    const { path, url } = useRouteMatch();

    return <Switch>
        <div>PLACEHOLDER</div>
    </Switch>

    //    return <div className="tabbedPage">
    //        <div className="tabLinks">
    //            <NavLink activeClassName="selected" to={ `${path}/log` }>log</NavLink>
    //            <NavLink activeClassName="selected" to={ `${path}/users` }>users</NavLink>
    //        </div>
    //        <Switch>
    //            <Route path={ `${path}/log` }>
    //                <div className="log">log placeholder</div>
    //            </Route>
    //            <Route path={ `${path}/users` }>
    //                <UserAdmin />
    //            </Route>
    //        </Switch>
    //    </div>
};
