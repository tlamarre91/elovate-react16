import React from 'react';
import * as BP from '@blueprintjs/core';

import { log } from '~shared/log';
import appState from '~client/app-state';
import {
    LoginDialog,
} from '~client/components';

export interface AuthWallProps {
    notAuthorizedText?: string;
    children: JSX.Element;
}

export const AuthWall: React.FC<AuthWallProps> = (props) => {
    const { notAuthorizedText, children } = props;
    const { siteInitialized, loggedInUser, setLoggedInUser } = React.useContext(appState);

    if (siteInitialized) {
        if (loggedInUser) {
            return <>{ children }</>;
        }
        return (
          <div className="notAuthorized">
              <h3>{ notAuthorizedText ?? 'You must log in to access this page' }</h3>
              <LoginDialog onUserChange={setLoggedInUser} />
            </div>
        );
    }
    return null;
};
