import * as React from "react";

import * as BP from "@blueprintjs/core";

import {
    Link,
    useHistory,
    useRouteMatch,
} from "react-router-dom";

import {
    AuthWall,
    ErrorBoundary as EB,
    GroupList,
    PageTitle,
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
                <PageTitle>My groups</PageTitle>
                <Link to="groups/new">Create new group</Link>
                <GroupList makeLinks query={ "myGroups" } displayIfEmpty={ noGroupsPrompt } />
            </div>
        </AuthWall>
    </EB>
}
