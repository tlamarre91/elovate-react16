import * as React from "react";
import { render } from "react-dom";

import { log } from "./log";
import {
    UserProps,
    Receiver
} from "../api";

import {
    UserSearchComponent,
} from "./UserSearchComponent";

export const UserListItem = (user: UserProps) => {
    return <div className="userListItem">{ user.username }</div>
};

export const UserList = (users: UserProps[]) => {
    // TODO: Figure out why i can't use function components the way i'm supposed to!!! (i.e. as jsx tags)
    return <div className="userList">
        { users.map(user => UserListItem(user)) }
    </div>
};

interface UserSearchResultListProps {
    /**
     * Base string for ID of rendered tags.
     * Also identifies this component when subscribing as a Receiver.
     */
    id: string;
    maxDisplayed?: number;
    providerId: string;
}

interface UserSearchResultListState {
    users: UserProps[];
    provider: UserSearchComponent;
    lastUpdate: number;
}

export class UserSearchResultList extends React.Component<UserSearchResultListProps, UserSearchResultListState> {
    constructor(props: UserSearchResultListProps) {
        super(props);
        //this.state = state;
    }

    receiver: Receiver<UserProps[]> = {
        id: this.props.id,
        data: (users: UserProps[]) => {
            this.setState({
                users,
                lastUpdate: Date.now()
            });
        }
    }

    setProvider(p: UserSearchComponent) {
        p.addReceiver(this.receiver);
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        try {
            this.state.provider.removeReceiver(this.receiver.id);
        } catch (err) {
            log.error(err);
        }
    }

    render() {
        return UserList(this.state.users);
    }
}
