import * as React from "react";
import { render } from "react-dom";
import {
    Card,
    Colors,
} from "@blueprintjs/core";

import { log } from "./log";
import {
    UserProps,
    Receiver
} from "../api";

export interface UserCardProps {
    user: UserProps;
    hidden?: boolean;
    focused?: boolean;
    linkUser?: boolean;
    interactive?: boolean;
}

export const UserCard = (props: UserCardProps) => {
    const className = `userCard ${ props.focused ? "focused" : "" } ${ props.hidden ? "hidden" : "" }`;
    const { user, hidden, focused, linkUser, interactive } = { ... props };

    //const displayNameElem = linkUser ? <h5><a href= { `/user/id/${user.id}` }>{ user.displayName }</a></h5>
    //: <h4>{ user.displayName }</h4>;

    const displayNameElem = <h4>
        {
            linkUser ? <a href={ `/user/id/${user.id}` }>{ user.displayName }</a>
                : user.displayName
        }
        </h4>;

    const usernameElem = user.username ? <p>{ user.username }</p>
        : <p style={{ color: Colors.GRAY1 }}><em>no username</em></p>;

    const emailElem = user.email ? <p>{ user.email }</p>
        : <p style={{ color: Colors.GRAY1 }}><em>no email</em></p>;

    return (
        <Card className={className} interactive={interactive}>
            <div className="icon">
                <img src="/assets/img/elovate-50x50.png" alt={`${user.username}'s user icon`} />
            </div>
            <div className="displayName">
                {displayNameElem}
            </div>
            <div className="username">
                {usernameElem}
            </div>
            <div className="email">
                {emailElem}
            </div>
        </Card>
    );
}
