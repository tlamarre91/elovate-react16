// TODO: already deprecated. making GroupList now, rewrite this to match
import React from 'react';

import * as Api from '~shared/api';
import { log } from '~shared/log';
import { UserDto } from '~shared/data-transfer-objects';

export interface UserTableProps {
    pageLength: number;
    columnFilter?: string[];
    load: () => Promise<UserDto[]>;
}

export const UserTable: React.FC<UserTableProps> = (props) => {
    // TODO: props needs to actually take a cursor or something
    // TODO: actually add all columns;
    const allColumns = ['id', 'username', 'email'];

    const columnFilterFn: (arg0: string) => [string, boolean] = (
        col: string,
    ) => {
        if (props?.columnFilter ?? false) {
            return [col, props.columnFilter.includes(col)];
        }
        return [col, true];
    };

    const [displayedColumns, setDisplayedColumns] = React.useState<
        [string, boolean][]
    >(allColumns.map(columnFilterFn));

    const [loadedUsers, setLoadedUsers] = React.useState<UserDto[]>([]);
    const [visibleUsers, setVisibleUsers] = React.useState<UserDto[]>([]);
    const [status, setStatus] = React.useState<string>('');
    const [page, setPage] = React.useState<number>(0);

    const nPages = () => {
        if (props.pageLength > 0) {
            return Math.ceil((loadedUsers?.length ?? 0) / props.pageLength);
        }
        throw new Error(`invalid prop: pageLength (${props.pageLength})`);
    };

    const incPage = (delta: number) => () => {
        const p1 = page + delta;
        const newPage = p1 <= 0 ? 0 : p1 >= nPages() ? nPages() - 1 : p1;

        setPage(newPage);
    };

    const refreshVisibleUsers = () => {
        if (loadedUsers) {
            const startIdx = page * props.pageLength;
            setVisibleUsers(
                loadedUsers.slice(startIdx, startIdx + props.pageLength),
            );
        } else {
            log.warn('UserList: users not loaded');
        }
    };

    React.useEffect(() => {
        const to = window.setTimeout(() => {
            setStatus('loading...');
        }, 100);

        props
            .load()
            .then((data) => {
                window.clearTimeout(to);
                setStatus('');
                setLoadedUsers(data);
            })
            .catch((err) => {
                window.clearTimeout(to);
                setStatus(`error: ${err}`);
                log.warn(err);
            });
    }, []);

    React.useEffect(refreshVisibleUsers, [page, loadedUsers]);

    // TODO: actually use displayedColumns
    return (
        <div className="userTableContainer">
            {nPages() > 1 ? (
                <div className="controls">
                    <button className="prev" onClick={incPage(-1)}>
                    prev page
                    </button>
                    <div className="pageNumber">
                    page
                        {page + 1}
                        {' '}
                    of
                        {nPages()}
                    </div>
                    <button className="next" onClick={incPage(1)}>
                    next page
                    </button>
                </div>
            ) : null}
            {status ? <div className="status">{status}</div> : null}
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>username</th>
                        <th>email</th>
                    </tr>
                </thead>
                <tbody>
                    {visibleUsers.map((u) => {
                        log.info(`rendering row for user ${u?.id}`);
                        return (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.username}</td>
                                <td>{u.email}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};
