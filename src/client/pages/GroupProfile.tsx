import React from "react";
import {
    Link,
    Route,
    Switch,
    useParams,
    useRouteMatch,
} from "react-router-dom";

import { log } from "~shared/log";
import * as Api from "~shared/api";
import * as Dto from "~shared/data-transfer-objects";

import {
    GroupUserPrivilege
} from "~shared/enums";

import {
    getOneGroup
} from "~client/query-runners";

import {
    AuthWall,
    PageTitle,
    GroupEditForm,
} from "~client/components";

import {
    appState
} from "~client/app-state";

interface GroupProfileProps {
}

export const GroupProfile: React.FC<GroupProfileProps> = (props) => {
    const { loggedInUser } = React.useContext(appState);
    const [ready, setReady] = React.useState<boolean>(false);
    const [group, setGroup] = React.useState<Dto.GroupDto>();
    const [error, setError] = React.useState<string>();
    const { path, url } = useRouteMatch();
    const { query } = useParams<{ query: string }>();

    React.useEffect(function loadGroup() {
        getOneGroup(query).then(group => {
            setGroup(group);
            setError(null);
            setReady(true);
        }).catch(err => {
            log.error(`GroupProfile: ${err}`);
            setError(err);
            setReady(true);
        });
    }, []);

    const loggedInUserIsAdmin: boolean = group?.memberships
        ?.some(m => m.privilege === GroupUserPrivilege.admin && m.user.id === loggedInUser.id) ?? false;

    const mainProfile = !group ? null : (
        <>
            <PageTitle>{ group.name }</PageTitle>
            { loggedInUserIsAdmin ? <div className="editGroupLink"><Link to={ `${url}/edit` }>Edit group</Link></div> : null }
            { !group.publicVisible ? <div className="privateTag tag">private</div> : null }
            { !group.publicJoinable ? <div className="requiresInviteTag tag">requires invite</div> : null }
            <div className="groupDescription">{ group.description }</div>
            <div className="customUrl">@{ group.customUrl }</div>
            <section className="userListContainer">
                <div className="userListTitle">
                    <h4>Members</h4>
                </div>
                <div className="userList">{
                    group.memberships.map(m => {
                        const { user, privilege } = m;
                        return <div key={ user.id } className="userListItem">
                            <div className="username">{ user.username }</div>
                            <div className="privilege">{ privilege }</div>
                        </div>
                    })
                }
                </div>
            </section>
        </>
    )

    const editGroupPage = (!group || !loggedInUserIsAdmin) ? null : (
        <>
            <PageTitle>Edit group</PageTitle>
            <GroupEditForm group={ group } />
        </>
    )

    return <div className="groupProfile page">
        { !ready
            ? <div className="loading">loading profile</div>
            : group ? <Switch>
                <Route exact path={ path }>
                    { mainProfile }
                </Route>
                <Route path={ `${path}/matches` }>
                    <div>matches here!</div>
                </Route>
                <Route exact path={ `${path}/edit` }>
                    <AuthWall>
                        { editGroupPage }
                    </AuthWall>
                </Route>
            </Switch>
            : <div className="error">
                <p>could not load group</p>
                <p>{ error }</p>
            </div>
        }
    </div>
}
