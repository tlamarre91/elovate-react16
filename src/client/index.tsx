import * as React from "react";
import { render } from "react-dom";

import { log } from "./log";
//import * as Api from "../api";
import * as Api from "~shared/api";
Api.setLogger(log);
import styleVars from "./styleVariables";
import {
    UserSearchComponent,
} from "./UserSearchComponent";

import {
    AdminControlsComponent
} from "./AdminControlsComponent";

function main() {
    log.info("running main()");
    const searchCmpt = <UserSearchComponent value="user" id="userSearchInput" interactiveResults={ true } searchTimeoutLength={ 50 } />
    render(searchCmpt, document.getElementById("userSearchContainer"));

    const adminCmpt = <AdminControlsComponent />;
    render(adminCmpt, document.getElementById("adminControlsContainer"));

    // let elems = document.querySelector("#sidebar");

}

console.log("ah fuck, i can't believe you've done this");
document.addEventListener("DOMContentLoaded", main);
