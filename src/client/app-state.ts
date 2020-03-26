import React from 'react';

import {
    UserDto,
} from '~shared/data-transfer-objects';

export interface IAppState {
    siteInitialized: boolean;
    loggedInUser: UserDto;
    setLoggedInUser: (user: UserDto) => void;
    setSiteInitialized: (newState: boolean) => void;
}

export const appState = React.createContext<IAppState>({
    siteInitialized: false,
    loggedInUser: null,
    setLoggedInUser: null,
    setSiteInitialized: null,
});

export default appState;
