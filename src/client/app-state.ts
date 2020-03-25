import React from "react";

import {
    UserDto
} from "~shared/data-transfer-objects";
import {
    NavMapRecord
} from "~client/components/NavMap";

export interface IAppState {
    loggedInUser: UserDto;
    setLoggedInUser: (user: UserDto) => void;
    navMapRecord: NavMapRecord;
}

export const appState = React.createContext<IAppState>({
    loggedInUser: null,
    setLoggedInUser: null,
    navMapRecord: null,
});

export default appState;
