import * as React from "react";
import { render } from "react-dom";

import { elmt } from "~client/util";
import { log } from "~shared/log";

import * as Api from "~shared/api";
import * as Dto from "~shared/data-transfer-objects";

export const UserCard = (user: Dto.UserDto) => {
    return <div className="userCard">
        <div className="username">{ user.username }</div>
    </div>
};
