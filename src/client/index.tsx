import * as React from "react";
import { render } from "react-dom";

import { log } from "./log";

import {
    UserSearchComponent,
} from "./UserSearchComponent";

import {
    UserSearchResultList
} from "./UserComponents";


import {
    UserProps,
    Receiver,
} from "../api";

function main() {
    const testReceiver: Receiver<UserProps[]> = {
        id: "testReceiver",
        data: (users: UserProps[]) => {
            users.forEach(u => log.info(`GOT 'IM, BOSS! ${ u.username }`));
        }
    }
    log.info("running main()");
    const searchCmpt = <UserSearchComponent value="default value" id="userSearchInput" searchTimeoutLength={ 1000 } />

    //const resultCmpt = <UserSearchResultList id="resultsList" provider={ searchCmpt } />;
    render(searchCmpt, document.getElementById("userSearchContainer"));
}

main();
