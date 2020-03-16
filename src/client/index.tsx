import React from "react";
import { render } from "react-dom";

import { log } from "~shared/log";

import { SiteRouter } from "~client/routes";

function main() {
    const navElement = document.getElementById("appBarNavContainer");
    const loggedInUserWidgetElement = document.getElementById("loggedInUserWidgetContainer");
    render( <SiteRouter
        navElement={ navElement }
        loggedInUserWidgetElement={ loggedInUserWidgetElement }
    />, document.getElementById("contentContainer"));
}

document.addEventListener("DOMContentLoaded", main);
