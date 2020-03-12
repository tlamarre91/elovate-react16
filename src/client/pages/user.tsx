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
import * as Api from "~shared/api";
import * as Dto from "~shared/model/data-transfer-objects";

export interface UserProfileProps {
    query?: string;
}

export const UserProfile: React.FC<UserProfileProps> = (props) => {
    const { query } = useParams();
    const [userDto, setUserDto] = React.useState<Dto.UserDto>(null);
    const [status, setStatus] = React.useState<string>("loading...");
    React.useEffect(() => {
        log.info(`using effect... ${Date.now()}`);
        const call = new Api.Get<Dto.UserDto>(window.location.href, Api.Resource.User, query);
        call.execute().then(res => {
            if (res.success) {
                setStatus("");
                setUserDto(res.data);
            } else {
                setStatus("failed :(");
            }
        });
    }, []);

    return <div className="userProfile">
        { status ? <div className="status">{ status }</div> : null}
        { userDto ? <div className="username">{ userDto.username }</div> : <p>still loading this sorry user</p> }
    </div>
}

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
