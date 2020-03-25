import React from "react";
import * as BP from "@blueprintjs/core";

import { log } from "~shared/log";
import * as Api from "~shared/api";
import * as Dto from "~shared/data-transfer-objects";

interface GroupListItemProps {
    group: Dto.GroupDto;
    expanded?: boolean;
}

const GroupListItem: React.FC<GroupListItemProps> = ({ group, expanded }) => {
    return <div className="groupListItem">
        <div className="icon">
            <BP.Icon icon="graph" />
        </div>
        <div className="groupName">
            { group.name }
        </div>
        <div className="groupInfo">
            group info placeholder
        </div>
        <div className="controls">
            <BP.Icon icon="edit" />
        </div>
    </div>
}

export interface GroupListProps {
    pageLength?: number;
    //displayFields?: (keyof Dto.GroupDto)[];
    query?: Api.Get<Dto.GroupDto[]>;
    displayIfEmpty?: React.ReactElement<any>;
}

export const GroupList: React.FC<GroupListProps> = (props) => {
    const [ready, setReady] = React.useState<boolean>(false);
    const [loadedGroups, setLoadedGroups] = React.useState<Dto.GroupDto[]>();
    const [visibleGroups, setVisibleGroups] = React.useState<Dto.GroupDto[]>();
    const [status, setStatus] = React.useState<string>();
    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const pageCount = () => {
        if ((props?.pageLength ?? false) && props.pageLength > 0) {
            return Math.ceil((loadedGroups?.length ?? 0) / props.pageLength);
        } else {
            return 1;
        }
    };

    const refreshVisibleGroups = () => {
        if (loadedGroups) {
            if (props?.pageLength > 0) {
                const startIdx = currentPage * props.pageLength;
                setVisibleGroups(loadedGroups.slice(startIdx, startIdx + props.pageLength));
            } else {
                setVisibleGroups(loadedGroups);
            }

            setReady(true);
        } else {
            log.warn(`GroupTable: groups not loaded`);
        }
    }

    const loadGroups = () => {
        log.info("RUNNING");
        setStatus("loading groups");
        setReady(false);
        if (props.query) {
            props.query.execute().then(res => {
                if (res.success) {
                    setStatus(null);
                    setLoadedGroups(res.data);
                } else {
                    const msg = `GroupTable loadGroups: ${res.error}`;
                    setStatus(msg);
                    log.error(msg);
                }
            });
        } else {
            log.warn(`GroupTable: dunno how to load the groups, boss. gimme a query prop or somethin'`);
        }
    }

    React.useEffect(refreshVisibleGroups, [currentPage, loadedGroups]);
    React.useEffect(loadGroups, []);

    return <div className="groupList">
        {
            pageCount() > 1 ? 
            <div className="controls">
                controls placeholder
            </div>
            : null
        }
        { status ? <div className="status">{ status }</div> : null }
    { ready ? loadedGroups.length > 0 ? visibleGroups.map((group: Dto.GroupDto) => <GroupListItem key={ group.id } group={ group } />)
            : props.displayIfEmpty
        : null }
    </div>
}
