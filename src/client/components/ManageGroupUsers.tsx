import React from 'react';
import {
    Link,
    Route,
    Switch,
    useParams,
    useRouteMatch,
} from 'react-router-dom';

import { log } from '~shared/log';
import * as Api from '~shared/api';
import * as Dto from '~shared/data-transfer-objects';

import { GroupUserPrivilege } from '~shared/enums';

export interface ManageGroupUsersProps {
    group: Dto.GroupDto;
}

export const ManageGroupUsers: React.FC<ManageGroupUsersProps> = (props) => {
    return <div>placeholder</div>
}
