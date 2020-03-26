import * as React from "react";

import * as BP from "@blueprintjs/core";

import {
    useHistory,
    useRouteMatch,
} from "react-router-dom";

import {
    AuthWall,
    ErrorBoundary as EB,
    GroupList,
} from "~client/components";

import * as Api from "~shared/api";
import { log } from "~shared/log";

interface MyGroupsPageProps {
}

export const MyGroupsPage: React.FC<MyGroupsPageProps> = (props) => {
    const history = useHistory();
    const { path } = useRouteMatch();
    const noGroupsPrompt = <div>
        Looks like you aren't a member of any groups! <BP.Button onClick={ () => history.push(`${path}/new`) }>Create a group</BP.Button>
    </div>

    return <EB>
        <AuthWall>
            <div className="myGroupsPage page">
                <h3>My groups</h3>
                <GroupList query={ new Api.Get(Api.Resource.Group, "myGroups") } displayIfEmpty={ noGroupsPrompt } />
            </div>
        </AuthWall>
    </EB>
}
