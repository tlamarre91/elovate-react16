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

type UserSearchComponentProps = {
    /**
     * Initial search input value
     */
    value?: string;

    /**
     * Base string for ID of rendered tags
     */
    id: string;

    /**
     * Delay between last keystroke and automatic search and update (in ms).
     *
     * value <= 0 | undefined ? no automatic search
     *
     * TODO: client-side instant update if new string is substring of last complete search
     */
    searchTimeoutLength: number;

    receiver?: Receiver<UserProps[]>;
    receivers?: Receiver<UserProps[]>[];
};

type UserSearchComponentState = {
    value: string;
    timeoutId: number;
    receivers: Receiver<UserProps[]>[];
}

export class UserSearchComponent extends React.Component<UserSearchComponentProps, UserSearchComponentState> {
    constructor(props: UserSearchComponentProps) {
        super(props);

        let recs: Receiver<UserProps[]>[] = [];
        if (this.props.receivers) {
            recs = recs.concat(this.props.receivers);
        }
        if (this.props.receiver) {
            recs.push(this.props.receiver);
        }

        this.state = {
            value: props.value ? props.value : "",
            timeoutId: 0,
            receivers: recs
        };
    }

    private originStr() {
        return window.location.href;
    }

    runSearch() {
        const params = new UserSearchParams("username", "contains", this.state.value);
        const call = new ApiQuery<UserProps[]>(this.originStr(), Endpoint.SearchUsers, params);
        call.execute().then(res => {
            if (! res.success) {
                const err = res.error;
                log.error(err);
                throw Error(err);
            } else if (this.state.receivers.length > 0) {
                this.state.receivers.forEach(rec => rec.data(res.data));
            } else {
                log.warn(`ran user search with no receivers: ${ this.originStr() }`);
            }
        });
    }

    private handleClick = () => {
        window.clearTimeout(this.state.timeoutId);
        this.runSearch();
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

        log.info("queueing search");
        const newTO: number = window.setTimeout(this.runSearch.bind(this), this.props.searchTimeoutLength);
        return newTO;
    }

    componentDidMount() {
        log.info("did mount");
    }

    componentWillUnmount() {
        this.setState({ receivers: null });
        clearTimeout(this.state.timeoutId);
    }

    addReceiver(rec: Receiver<UserProps[]>) {
        this.setState((prevState, props) => {
            const prevReceivers = prevState.receivers;
            if (prevReceivers.map(r => r.id).includes(rec.id)) {
                throw Error(`receiver already assigned to UserSearchComponent ${ props.id } with id ${ rec.id }`);
            } else {
                return { receivers: prevReceivers.concat(rec) };
            }
        });
    }

    removeReceiver(id: String) {
        this.setState(prevState => ({
            receivers: prevState.receivers.filter(rec => rec.id !== id)
        }));
    }

    render() {
        return <div className="userSearchComponent">
            <div>
                <input id={ this.props.id } type="text" onChange={ this.handleInputChange } />
                <button onClick={ this.handleClick }>search</button>
            </div>
        </div>;
    }
}

