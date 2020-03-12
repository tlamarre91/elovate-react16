import React from "react";
import { render } from "react-dom";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
} from "react-router-dom";

import { UserProfile } from "~client/components/UserProfile";

export const UserRouter: React.FC = () => {
    const { path, url } = useRouteMatch();

    return <Router>
        <Switch>
            <Route exact path={ path }>
                <div>wanna list all users...</div>
            </Route>
            <Route path={ `${path}/:query` }>
                <UserProfile />
            </Route>
        </Switch>
    </Router>
}

export default UserRouter;
