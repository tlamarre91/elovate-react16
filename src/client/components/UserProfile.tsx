import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch,
} from 'react-router-dom';

import { log } from '~shared/log';
import * as Api from '~shared/api';
import * as Dto from '~shared/data-transfer-objects';

export interface UserProfileProps {
    query?: string;
}

export const UserProfile: React.FC<UserProfileProps> = (props) => {
    const { query } = useParams();
    const [userDto, setUserDto] = React.useState<Dto.UserDto>(null);
    const [status, setStatus] = React.useState<string>('loading...');
    React.useEffect(() => {
        const call = new Api.Get<Dto.UserDto>(Api.Resource.User, query);
        call.execute().then((res) => {
            if (res.success) {
                setStatus('');
                setUserDto(res.data);
            } else {
                setStatus('failed :(');
            }
        });
    }, []);

    return (
      <div className="userProfile">
            { status ? <div className="status">{ status }</div> : null}
            { userDto ? <div className="username">{ userDto.username }</div> : <p>still loading this sorry user</p> }
        </div>
    );
};
