import * as React from "react";
import { render } from "react-dom";

import { log } from "./log";

import {
    UserSearchComponent,
} from "./UserSearchComponent";

import {
    AdminControlsComponent
} from "./AdminControlsComponent";


// import * as Api from "../api";

function main() {
    log.info("running main()");
    const searchCmpt = <UserSearchComponent value="user" id="userSearchInput" searchTimeoutLength={ 1000 } />
    render(searchCmpt, document.getElementById("userSearchContainer"));

    const adminCmpt = <AdminControlsComponent />;
    render(adminCmpt, document.getElementById("adminControlsContainer"));
}

main();
