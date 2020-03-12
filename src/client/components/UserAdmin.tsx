import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch
} from "react-router-dom";

import * as Api from "~shared/api";
import { log } from "~shared/log";
import { UserDto } from "~shared/model/data-transfer-objects";

import { UserTable } from "~client/components/UserTable";

export const UserAdmin: React.FC = () => {
    return <div className="userAdminContainer">
        <UserTable pageLength={ 2 } load={ async () => {
            const call = new Api.Get<UserDto[]>(window.location.href, Api.Resource.User, "all");
            return call.execute().then(res => res.data);
        } } />
    </div>
};
