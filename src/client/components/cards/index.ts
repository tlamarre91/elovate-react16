import * as React from "react";
import { render } from "react-dom";

import { elmt } from "~client/util";
import { log } from "~client/log";

import * as Api from "~shared/api";
import * as Model from "~shared/model";

export const UserCard = (user: Model.User) => { // TODO: Use some Pick<User, ...> type
    return elmt("div", null, [
        elmt("p", { key: 0 }, "it's a user card!"),
        elmt("p", { key: 1 }, user.username)
    ]);
};
