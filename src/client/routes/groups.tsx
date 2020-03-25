import React from "react";
import { render } from "react-dom";
import * as BP from "@blueprintjs/core";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch,
    useHistory
} from "react-router-dom";

import {
    withBreadcrumb
} from "react-breadcrumbs-context";

import appState from "~client/app-state";
import * as Api from "~shared/api";
import * as Dto from "~shared/data-transfer-objects";
import {
    AuthWall,
    GroupProfile,
    GroupList,
    GroupCreateForm,
} from "~client/components";

import {
    NavMap
} from "~client/components/NavMap";

import {
    GroupCreatePage
} from "~client/pages";


export const GroupRouter: React.FC = (props) => {
    const { path, url } = useRouteMatch();
    const { loggedInUser, navMapRecord } = React.useContext(appState);
    const history = useHistory();

    const createGroupPrompt = <div>
        Looks like you aren't a member of any groups! <BP.Button onClick={ () => history.push(`${path}/new`) }>Create a group</BP.Button>
    </div>

    //    const groups = ["test", "blah", "doof"].map((s,i) => {
    //        const dto = new Dto.GroupDto();
    //        dto.id = i;
    //        dto.name = s;
    //        dto.customUrl = s;
    //        return dto;
    //    });

    const navItems = [
        { path: `${path}/new`, text: "Create new group" },
        { path: `${path}/manage`, text: "Manage groups" },
    ];

    return (
        <>
            <NavMap name="groupRouter" items={ navItems } record={ navMapRecord }/>
            <Switch>
                <Route exact path={ path }>
                    <AuthWall>
                        <GroupList query={ new Api.Get(Api.Resource.Group, "myGroups") } displayIfEmpty={ createGroupPrompt } />
                    </AuthWall>
                </Route>
                <Route exact path={ `${path}/new` }>
                    <AuthWall>
                        <GroupCreatePage />
                    </AuthWall>
                </Route>
                <Route path={ `${path}/:query` }>
                    <GroupProfile />
                </Route>
            </Switch>
        </>
    )
}

export default GroupRouter;

