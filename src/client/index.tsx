import * as React from "react";
import { render } from "react-dom";

import { log } from "./log";
import {
    UserSearchComponent,
} from "./UserSearchComponent";

import {
    UserProps,
    Receiver,
} from "../api";

function main() {
    const testReceiver: Receiver<UserProps[]> = {
        data: (users: UserProps[]) => {
            users.forEach(u => log.info(`GOT 'IM, BOSS! ${ u.username }`));
        }
    }
    log.info("running main()");
    const cmpt = <UserSearchComponent value="default value" inputElmtId="userSearchInput" searchTimeoutLength={ 1000 } outputReceivers={ [testReceiver] } />
    // const cmpt = <UserSearchComponent value="default value" inputElmtId="userSearchInput" searchTimeoutLength={ 2000 } />
    // const cmpt = <UserSearchComponent value="default value" inputElmtId="userSearchInput" />
    render(cmpt, document.getElementById("userSearchContainer"));
}

main();
