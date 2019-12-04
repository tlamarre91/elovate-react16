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
//const linkUrl = (props.linkUser && props.user.id) ? `/user/${ props.user.id }` : "#";
    const { user, hidden, focused, linkUser, interactive } = { ... props };

    const displayNameElem = linkUser ? <h5><a href= { `/user/id/${user.id}` }>{ user.displayName }</a></h5>
        : <h4>{ user.displayName }</h4>;

    const usernameElem = user.username ? <p>{ user.username }</p>
        : <p style={{ color: Colors.GRAY1 }}><em>no username</em></p>;

    const emailElem = user.email ? <p>{ user.email }</p>
        : <p style={{ color: Colors.GRAY1 }}><em>no email</em></p>;

    return (
            <Card className={ className } interactive={ interactive }>
                <div className="displayName">
                    { displayNameElem }
                </div>
                <div className="username">
                    { usernameElem }
                </div>
                <div className="email">
                    { emailElem }
                </div>
            </Card>
    );

    //    return <a href={ linkUrl }>
    //        <div className={ className } >
    //            <div className="icon">
    //                <img src="/assets/img/icons/circle.svg" />
    //            </div>
    //            <div className="info">
    //                <div className="displayName">{ props.user.displayName }</div>
    //                <div className="username">{ props.user.username }</div>
    //                <div className="email">{ props.user.email }</div>
    //            </div>
    //        </div>
    //    </a>
}
