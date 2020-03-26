import React from 'react';
import * as BP from '@blueprintjs/core';

import {
    Link,
} from 'react-router-dom';

import { log } from '~shared/log';
import * as Api from '~shared/api';
import * as Dto from '~shared/data-transfer-objects';

import {
    getOneGroup,
    getManyGroups,
} from '~client/query-runners';

interface GroupListItemProps {
    group: Dto.GroupDto;
    expanded?: boolean;
    makeLinks?: boolean;
}

const GroupListItem: React.FC<GroupListItemProps> = ({ group, expanded, makeLinks }) => {
    const nameElmt = (makeLinks
        ? (
            <Link to={`/groups/${group.id}`}>
            <div className="groupName">
                  { group.name }
                </div>
          </Link>
        )
        : (
          <div className="groupName">
                { group.name }
            </div>
        )
    );

    return (
      <div className="groupListItem">
            <div className="icon">
                <BP.Icon icon="graph" />
        </div>
            { nameElmt }
            <div className="controls">
                <BP.Icon icon="edit" />
        </div>
        </div>
    );
};

export interface GroupListProps {
    pageLength?: number;
    // displayFields?: (keyof Dto.GroupDto)[];
    query?: string;
    displayIfEmpty?: React.ReactElement<any>;
    makeLinks?: boolean;
}

export const GroupList: React.FC<GroupListProps> = ({
    pageLength, query, displayIfEmpty, makeLinks,
}) => {
    const [ready, setReady] = React.useState<boolean>(false);
    const [loadedGroups, setLoadedGroups] = React.useState<Dto.GroupDto[]>();
    const [visibleGroups, setVisibleGroups] = React.useState<Dto.GroupDto[]>();
    const [status, setStatus] = React.useState<string>();
    const [currentPage, setCurrentPage] = React.useState<number>(0);
    const pageCount = () => {
        if ((pageLength ?? false) && pageLength > 0) {
            return Math.ceil((loadedGroups?.length ?? 0) / pageLength);
        }
        return 1;
    };

    const refreshVisibleGroups = () => {
        if (loadedGroups) {
            if (pageLength > 0) {
                const startIdx = currentPage * pageLength;
                setVisibleGroups(loadedGroups.slice(startIdx, startIdx + pageLength));
            } else {
                setVisibleGroups(loadedGroups);
            }

            setReady(true);
        } else {
            log.warn('GroupTable: groups not loaded');
        }
    };

    const loadGroups = () => {
        log.info('RUNNING');
        setStatus('loading groups');
        setReady(false);
        if (query) {
            getManyGroups(query).then((groups) => {
                setLoadedGroups(groups);
                setStatus(null);
            }).catch((err) => {
                setStatus(err);
                log.error(err);
            });
        } else {
            log.warn('GroupTable: dunno how to load the groups, boss. gimme a query prop or somethin\'');
        }
    };

    React.useEffect(refreshVisibleGroups, [currentPage, loadedGroups]);
    React.useEffect(loadGroups, []);

    return (
      <div className="groupList">
            {
                pageCount() > 1
                    ? (
                      <div className="controls">
                          controls placeholder
            </div>
                    )
                    : null
            }
            { status ? <div className="status">{ status }</div> : null }
            { ready ? loadedGroups.length > 0 ? visibleGroups.map((group: Dto.GroupDto) => <GroupListItem makeLinks={makeLinks} key={group.id} group={group} />)
                : displayIfEmpty
                : null }
        </div>
    );
};
