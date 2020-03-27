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

import { PageTitle } from '~client/components';

import appState from '~client/app-state';

import { GroupUserPrivilege } from '~shared/enums';

export interface GroupProfileProps {
    group: Dto.GroupDto;
    showAdmin: boolean;
}

export const GroupProfile: React.FC<GroupProfileProps> = ({ group, showAdmin }) => {
    const { url } = useRouteMatch();
    return ( <>
        {showAdmin
            ?  <div className='editGroupLink'> <Link to={`${url}/edit`}>Edit group</Link></div> 
            : null}
        {!group.publicVisible
            ?  <div className='privateTag tag'>private</div>
            : null}
        {!group.publicJoinable
            ? <div className='requiresInviteTag tag'>requires invite</div>
            : null}
        <div className='groupDescription'>{group.description}</div>
        <div className='customUrl'>
            @{group.customUrl}
        </div>
        <section className='userListContainer'>
            <div className='userListTitle'>
                <h4>Members</h4>
                <Link to={`${url}/manageUsers`}>Manage users</Link>
            </div>
            <div className='userList'>
                {group.memberships.map((m) => {
                    const { user, privilege } = m;
                    return (
                        <div key={user.id} className='userListItem'>
                            <div className='username'>{user.username}</div>
                            <div className='privilege'>{GroupUserPrivilege[privilege]}</div>
                        </div>
                    );
                })}
            </div>
        </section>
    </> )
}
