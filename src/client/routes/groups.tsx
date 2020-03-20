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

import context from "~client/context";
import {
    GroupProfile
} from "~client/components";

export const GroupRouter: React.FC = (props) => {
    const { path, url } = useRouteMatch();

    return <Switch>
        <Route exact path={ path }>
            <div>placeholder</div>
        </Route>
        <Route path={ `${path}/:query` }>
            <GroupProfile />
        </Route>
    </Switch>
}

export default GroupRouter;

