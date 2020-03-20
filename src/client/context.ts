import React from "react";

import {
    UserDto
} from "~shared/data-transfer-objects";

export interface IContext {
    loggedInUser: UserDto;
    setLoggedInUser: (user: UserDto) => void;
}

export const context = React.createContext<IContext>({
    loggedInUser: null,
    setLoggedInUser: null
});

export default context
