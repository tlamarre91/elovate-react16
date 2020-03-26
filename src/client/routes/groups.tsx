import React from 'react';
import { render } from 'react-dom';
import * as BP from '@blueprintjs/core';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useParams,
    useRouteMatch,
    useHistory,
} from 'react-router-dom';

import {
    withBreadcrumb,
} from 'react-breadcrumbs-context';

import appState from '~client/app-state';
import { log } from '~shared/log';
import * as Api from '~shared/api';
import * as Dto from '~shared/data-transfer-objects';
import {
    AuthWall,
    GroupList,
    GroupCreateForm,
    // GroupEditForm,
} from '~client/components';

import {
    GroupCreatePage,
    GroupProfile,
    MyGroupsPage,
} from '~client/pages';


export const GroupRouter: React.FC = (props) => {
    const { path, url } = useRouteMatch();
    const { loggedInUser } = React.useContext(appState);
    const history = useHistory();

    //    const groups = ["test", "blah", "doof"].map((s,i) => {
    //        const dto = new Dto.GroupDto();
    //        dto.id = i;
    //        dto.name = s;
    //        dto.customUrl = s;
    //        return dto;
    //    });

    return (
        <>
            <Switch>
                <Route exact path={path}>
                    <MyGroupsPage />
              </Route>
                <Route exact path={`${path}/new`}>
                    <AuthWall>
                        <GroupCreatePage />
                  </AuthWall>
              </Route>
                <Route path={`${path}/:query`}>
                    <GroupProfile />
              </Route>
          </Switch>
      </>
    );
};

export default GroupRouter;
