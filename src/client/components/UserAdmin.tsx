import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch,
} from 'react-router-dom';

import * as Api from '~shared/api';
import { log } from '~shared/log';
import { UserDto } from '~shared/data-transfer-objects';

import { UserTable } from '~client/components/UserTable';

export const UserAdmin: React.FC = () => (
    <div className="userAdminContainer">
        <UserTable
        pageLength={2} load={async () => {
                const call = new Api.Get<UserDto[]>(Api.Resource.User, 'all');
                return call.execute().then((res) => res.data);
            }}
      />
  </div>
);
