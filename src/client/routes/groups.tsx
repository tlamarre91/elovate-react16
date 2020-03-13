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

import { GroupProfile } from "~client/components/GroupProfile";

export const GroupRouter: React.FC = () => {
    const { path, url } = useRouteMatch();

    return <Switch>
        <Route exact path={ path }>
            <div>wanna list all groups...</div>
        </Route>
        <Route path={ `${path}/:query` }>
            <GroupProfile />
        </Route>
    </Switch>
}

export default GroupRouter;

