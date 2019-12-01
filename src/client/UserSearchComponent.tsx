import * as React from "react";
import {
    render
} from "react-dom";

import {
    TextField
} from "@material-ui/core";

import { log } from "./log";

import * as Api from "../api";

import { UserCard } from "./UserComponents";

interface UserSearchComponentProps {
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
};

interface UserSearchComponentState {
    value: string;
    timeoutId: number;
    results: Api.UserProps[];
}

export class UserSearchComponent extends React.Component<UserSearchComponentProps, UserSearchComponentState> {
    constructor(props: UserSearchComponentProps) {
        super(props);

        this.state = {
            value: props.value ? props.value : "",
            timeoutId: 0,
            results: []
        };
    }

    private originStr() {
        return window.location.href;
    }

    runSearch() {
        const params = new Api.UserSearchParams({ username: this.state.value }, Api.SearchType.ContainsAll);
        const call = new Api.ApiQuery<Api.UserProps[]>(this.originStr(), Api.Endpoint.SearchUsers, params);
        call.execute().then(res => {
            if (! res.success) {
                const err = res.error;
                log.error(err);
                throw Error(err); // TODO: don't throw. just have a "toast" drop down to show error
            } else {
                this.setState({ results: res.data });
            }
        }).catch(err => {
            log.info("WUWUWUWU??")
            log.error(err);
        });
    }

    private handleClick = () => {
        window.clearTimeout(this.state.timeoutId);
        this.runSearch();
    };

    private handleInputChange = (event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const str: string = event.currentTarget.value;
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

        const newTO: number = window.setTimeout(this.runSearch.bind(this), this.props.searchTimeoutLength);
        return newTO;
    }

    render() {

        return <div className="userSearchComponent">
            <div>
                <TextField id={ this.props.id } label="Search users" variant="filled" onChange={ this.handleInputChange } />
                <button onClick={ this.handleClick }>search</button>
                { this.state.results.map((u, i) => <UserCard key={ i } user={ u } />) }
            </div>
        </div>;
    }
}

