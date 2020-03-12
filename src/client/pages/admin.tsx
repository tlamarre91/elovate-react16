import React, { FunctionComponent } from "react";
import { useFormik } from "formik";

import * as Api from "~shared/api";
import { log } from "~shared/log";
import { UserDto } from "~shared/model/data-transfer-objects";

interface AdminUserListProps {
    count: number;
}

interface AdminUserListState {
    users: Array<UserDto>;
    error: string;
}

//export const AdminUserList: FunctionComponent<AdminUserListProps> = ({ count }) => {
//    let results = new Array<UserDto>();
//    const userCall = new Api.Get(window.location.href, Api.Resource.User, "all");
//    const reload = async () => {
//        results = await userCall.execute().then(response => response.data as UserDto[]);
//    };
//
//    return results.slice(0, count).map(u => <div className="userCard">{ u.username }</div>);
//}

export class AdminUserList extends React.Component<AdminUserListProps, AdminUserListState> {
    refresh = async () => {
        const call = new Api.Get(window.location.href, Api.Resource.User, "all");
        const res = await call.execute();
        log.info(JSON.stringify(res.data as UserDto[], null, 2));
        if (res.success) {
            this.setState({
                error: null,
                users: res.data as UserDto[]
            });
        } else {
            this.setState({ error: res.error });
        }
    }
    //async refresh() {
    //    const call = new Api.Get(window.location.href, Api.Resource.User, "all");
    //    const res = await call.execute();
    //    if (res.success) {
    //        this.setState({
    //            error: null,
    //            users: res.data as UserDto[]
    //        });
    //    } else {
    //        this.setState({ error: res.error });
    //    }
    //}

    componentDidMount = () => {
        this.refresh();
    }

    render() {
        return <div className="userListContainer">
            <button onClick={ this.refresh }>refresh</button>
            <div className="userList">
            { this.state?.users
                ?.slice(0, this.props.count)
                ?.map((u,i) => <div key={ i } className="user">{ u.username }</div>) }
            </div>
        </div>;
    }
}

export const AdminPage: FunctionComponent = () => {
    return <div className="adminPage">
        <AdminUserList count={ 100 } />
    </div>
};
