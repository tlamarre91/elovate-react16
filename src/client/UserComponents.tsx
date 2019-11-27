import * as React from "react";
import { render } from "react-dom";

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
}

export const UserCard = (props: UserCardProps) => {
    const className = `userCard ${ props.focused ? "focused" : "" } ${ props.hidden ? "hidden" : "" }`;
    const linkUrl = (props.linkUser && props.user.id) ? `/user/${ props.user.id }` : "#";

    return <a href={ linkUrl }>
        <div className={ className } >
            <div className="icon">
                <img src="/assets/img/icons/circle.svg" />
            </div>
            <div className="info">
                <div className="displayName">{ props.user.displayName }</div>
                <div className="username">{ props.user.username }</div>
                <div className="email">{ props.user.email }</div>
            </div>
        </div>
    </a>
}
