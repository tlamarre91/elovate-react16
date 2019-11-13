import * as React from "react";
import { render } from "react-dom";

import { log } from "./log";

import {
    Endpoint,
    UserProps,
    UserSearchParams,
    ApiPost,
    ApiGet,
    ApiQuery,
    ApiResponse,
    Receiver
} from "../api";

// import {
//     UserList,
//     UserListItem,
// } from "./UserComponents";

type UserSearchComponentProps = {
    /**
     * Initial search input value
     */
    value?: string;

    /**
     * DOM ID of rendered <input /> tag
     * TODO: maybe "baseId" and explicitly derive all tag IDs from it
     */
    inputElmtId: string;

    /**
     * Component to populate with search results
     */

    /**
     * Delay between last keystroke and automatic search and update (in ms).
     *
     * value <= 0 | undefined ? no automatic search
     *
     * TODO: client-side instant update if new string is substring of last complete search
     */
    searchTimeoutLength?: number;

    // TODO: probably type should be Receiver<> | Receiver<>[]... but who cares
    outputReceivers?: Receiver<UserProps[]>[];
};

type UserSearchComponentState = {
    value: string;
    timeoutId: number;
}

export class UserSearchComponent extends React.Component<UserSearchComponentProps, UserSearchComponentState> {
    constructor(props: UserSearchComponentProps) {
        super(props);
        this.state = {
            value: props.value ? props.value : "",
            timeoutId: 0
        };
    }

    private originStr() {
        return window.location.href;
    }

    search() {
        const params = new UserSearchParams("username", "contains", this.state.value);
        const call = new ApiQuery<UserProps[]>(this.originStr(), Endpoint.SearchUsers, params);
        call.execute().then(res => {
            if (! res.success) {
                const err = res.error;
                log.error(err);
                throw Error(err);
            } else if (this.props.outputReceivers) {
                this.props.outputReceivers.forEach(rec => rec.data(res.data));
            } else {
                log.warn(`ran user search with no receivers: ${ this.originStr() }`);
            }
        });
    }

    private handleClick = () => {
        //const str: string = event.currentTarget.value;
        window.clearTimeout(this.state.timeoutId);
        this.search();
    };

    private handleInputChange = (event: React.FormEvent<HTMLInputElement>) => {
        const str: string = event.currentTarget.value;
        log.info(`changing search string: ${str}`);
        this.setState(() => {
            return {
                value: str,
                timeoutId: this.props.searchTimeoutLength > 0 ? this.queueSearch() : 0
            }
        });
    };

    /**
     * Run when text input is changed. Set a timer to run a search after props.searchTimeoutLength ms
     * if no further change occurs. Return the new timeout ID.
     */
    private queueSearch(): number {
        if (this.state.timeoutId) {
            clearTimeout(this.state.timeoutId);
        }

        const newTO: number = window.setTimeout(this.search.bind(this), this.props.searchTimeoutLength);
        return newTO;
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {
        return <div className="userSearchComponent">
            <div>
                <label htmlFor="userSearchInput" id={ `${ this.props.inputElmtId }Label` }>User search</label>
                <input id={ this.props.inputElmtId } type="text" onChange={ this.handleInputChange } />
                <button onClick={ this.handleClick }>search</button>
            </div>
        </div>;
    }
}

