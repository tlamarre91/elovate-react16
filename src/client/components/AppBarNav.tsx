import React from "react";

import * as BP from "@blueprintjs/core";

import {
    NavLink,
    useHistory,
} from "react-router-dom";

export interface AppBarNavProps {
}

export const AppBarNav: React.FC<AppBarNavProps> = (props) => {
    return <nav id="appBarNav">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/recent">Recent activity</NavLink>
    </nav>
}
