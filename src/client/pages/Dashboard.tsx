import React from "react";
import ReactDOM, {
    render,
    createPortal
} from "react-dom";
import { Helmet } from "react-helmet";
import {
    BrowserRouter as Router,
    Link,
    NavLink,
    Route,
    Switch,
    useHistory
} from "react-router-dom";

import context from "~client/context";
import * as Api from "~shared/api";
import * as Dto from "~shared/data-transfer-objects";
import { log } from "~shared/log";

export interface DashboardProps {
}

export const Dashboard: React.FC<DashboardProps> = (props) => {
    return <div className="dashboardContainer">
        <Helmet>
            <title>Dashboard</title>
        </Helmet>
    </div>
}
