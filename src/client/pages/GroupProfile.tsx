import React from "react";
import {
    useParams
} from "react-router-dom";

import { log } from "~shared/log";
import * as Api from "~shared/api";
import * as Dto from "~shared/data-transfer-objects";

interface GroupProfileProps {
}

export const GroupProfile: React.FC<GroupProfileProps> = (props) => {
    const [ready, setReady] = React.useState<boolean>(false);
    const [group, setGroup] = React.useState<Dto.GroupDto>();
    const [error, setError] = React.useState<string>();
    const { query } = useParams<{ query: string }>();

    React.useEffect(() => {
        const id: number = parseInt(query);
        log.info(`query: ${query}, id: ${id}`);
        if (! isNaN(id)) {
            try {
                new Api.Get<Dto.GroupDto>(Api.Resource.Group, `id/${id}`).execute().then(res => {
                    if (res.success) {
                        setGroup(res.data);
                        setReady(true);
                        setError(null);
                    } else {
                        log.error(`GroupProfile: ${res.error}`);
                        setReady(true);
                        setError(res.error);
                    }
                });
            } catch (err) {
                log.error(err);
                setError(err);
            }
        } else {
            log.error("GroupProfile: can only handle numeric IDs");
        }
    }, []);

    return <div className="groupProfile">
        { (() => {
            if (! ready) {
                return <div className="loading">{ query }</div>
            }

            if (! group) {
                return <div className="error">{ error }</div>
            }

            return (
                <>
                    <div className="groupName">{ group.name }</div>
                    <div className="groupDescription">{ group.description }</div>
                    <div className="customUrl">@{ group.customUrl }</div>
                </>
            )
        })() }
    </div>
}
