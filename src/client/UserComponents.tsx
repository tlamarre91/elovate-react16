import * as React from "react";
import { render } from "react-dom";

import { log } from "./log";
import {
    UserProps,
    Receiver
} from "../api";

export interface UserListItemProps {
    user: UserProps;
    focused?: boolean;
}

export interface UserListItemState {
    focused: boolean;
}

export class UserListItem extends React.Component<UserListItemProps, UserListItemState> {
    constructor(props: UserListItemProps) {
        super(props);
        const focused = this.props.focused !== undefined ? this.props.focused : false;
        this.state = { focused };
    }

    render() {
        return <div className="userListItem">
            { this.props.user.username }
        </div>
    }
}

export interface UserListProps {
    users: UserProps[];
}

export interface UserListState {
    users: (UserProps & { hidden: boolean })[];
    filter?: UserProps;
}

export class UserList extends React.Component<UserListProps, UserListState> {
    constructor(props: UserListProps) {
        super(props);
        this.state = {
            users: this.props.users.map(u => {
                return { ... u, hidden: false };
            })
        }
    }

    setFilter(userProps: UserProps) {
        this.setState(() => {
            return { filter: userProps }; // do i set user.hidden here or in render? or...?
        });
    }

    //update() {
    //}

    render() {
        const toDisplay: UserProps[] = this.state.users.filter(u => {
            const f = this.state.filter;
            if (! u.username.includes(f.username)) {
                return false;
            } else if (! u.email.includes(f.email)) {
                return false;
            } else if (! u.displayName.includes(f.displayName)) {
            }
        });
        return <div className="userList">
            { toDisplay.map(u => <UserListItem user={ u } /> ) }
        </div>
    }
}
