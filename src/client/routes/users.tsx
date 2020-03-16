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

import { log } from "~shared/log";
import { UserDto } from "~shared/model/data-transfer-objects";

import { UserProfile } from "~client/components/UserProfile";
import { UserCreateForm } from "~client/components/UserCreateForm";

export const UserRouter: React.FC = () => {
    const { path, url } = useRouteMatch();

    return <Switch>
        <Route exact path={ path }>
            <div>wanna list all users...</div>
        </Route>
        <Route path={ `${path}/profile` }>
            <div>HEEEEY ITS UR PROFILE</div>
        </Route>
        <Route path={ `${path}/new` }>
            <UserCreateForm onChange={ (user: UserDto) => { log.info(JSON.stringify(user, null, 2)) } } />
        </Route>
        <Route path={ `${path}/:query` }>
            <UserProfile />
        </Route>
    </Switch>
}

export default UserRouter;
