import React from "react";

import * as BP from "@blueprintjs/core";

import {
    useHistory
} from "react-router-dom";

import {
    NavMapDisplay,
    NavMapRecord,
} from "~client/components/NavMap";

export interface AppBarNavProps {
    record: NavMapRecord;
}

export const AppBarNav: React.FC<AppBarNavProps> = (props) => {
    return <nav id="appBarNav">
        <NavMapDisplay items={ props.record.items() } />
    </nav>
}
