import * as React from "react";
import { render } from "react-dom";

import { log } from "./log";
import {
    UserProps
} from "../api";


export const UserListItem = (user: UserProps) => {
    return <div className="userSearchListItem">{ user.username }</div>
};

export const UserList = (users: UserProps[]) => {
    const items = users.map(user => UserListItem(user));
    return <div className="userSearchList">{ items }</div>
};
