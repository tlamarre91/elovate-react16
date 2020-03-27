import React from 'react';
import {
    Link,
    Route,
    Switch,
    useParams,
    useHistory,
    useRouteMatch,
} from 'react-router-dom';

import { log } from '~shared/log';
import * as Api from '~shared/api';
import * as Dto from '~shared/data-transfer-objects';

import { GroupUserPrivilege } from '~shared/enums';

import { getOneGroup } from '~client/query-runners';

import {
    AuthWall,
    PageTitle,
    GroupEditForm,
    GroupProfile,
    ManageGroupUsers,
} from '~client/components';

import { appState } from '~client/app-state';

interface GroupDashboardProps {}

export const GroupDashboard: React.FC<GroupDashboardProps> = (props) => {
    const { loggedInUser } = React.useContext(appState);
    const [needsUpdate, setNeedsUpdate] = React.useState<number>(0);
    const [ready, setReady] = React.useState<boolean>(false);
    const [group, setGroup] = React.useState<Dto.GroupDto>();
    const [error, setError] = React.useState<string>();
    const { path, url } = useRouteMatch();
    const history = useHistory();
    const { query } = useParams<{ query: string }>();

    React.useEffect(() => {
        getOneGroup(query)
            .then((group) => {
                setGroup(group);
                setError(null);
                setReady(true);
            })
            .catch((err) => {
                log.error(`GroupProfile: ${err}`);
                setError(err);
                setReady(true);
            });
    }, [needsUpdate]);

    const loggedInUserIsAdmin: boolean = group?.memberships?.some(
            (m) => m.privilege === GroupUserPrivilege.admin
                && m.user.id === loggedInUser.id
        ) ?? false;

    const profilePage = !group ? null : (
        <>
            <PageTitle>{ group.name }</PageTitle>
            <GroupProfile group={ group } showAdmin={ loggedInUserIsAdmin } />
        </>
        )

    const editGroupPage = !group || !loggedInUserIsAdmin ? null : (
        <>
            <PageTitle>Edit group</PageTitle>
            <GroupEditForm group={group} onSuccess={() => {
                history.push(url);
                setNeedsUpdate(Date.now());
            }}/>
        </>
    );

    const manageUsersPage = !group || !loggedInUserIsAdmin ? null : (
        <>
            <PageTitle>Manage users</PageTitle>
            <ManageGroupUsers group={group} />
        </>
    );

    return (
        <div className='groupDashboard page'>
            {!ready ? (
                <div className='loading'>loading group dashboard</div>
            ) : group ? (
                <Switch>
                    <Route exact path={path}>
                        {profilePage}
                    </Route>
                    <Route path={`${path}/matches`}>
                        <div>matches here!</div>
                    </Route>
                    <Route exact path={`${path}/edit`}>
                        <AuthWall>{editGroupPage}</AuthWall>
                    </Route>
                </Switch>
            ) : (
                <div className='error'>
                    <p>could not load group</p>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};
