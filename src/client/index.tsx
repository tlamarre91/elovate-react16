import * as React from "react";
import { render } from "react-dom";

import * as Api from "~shared/api";

import { elmt } from "~client/util";
import { log } from "~client/log";

import { UserCard } from "~client/components/cards";

function main() {
    Api.setLogger(log);
    //render(UserCard({ 
    //    username: "tombo",
    //    email: "tombo@mambo.com"
    //}), document.getElementById("userSearchContainer"));
}

document.addEventListener("DOMContentLoaded", main);
