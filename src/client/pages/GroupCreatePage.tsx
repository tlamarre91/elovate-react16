import * as React from 'react';

import { GroupCreateForm, PageTitle } from '~client/components';

export interface GroupCreatePageProps {}

export const GroupCreatePage: React.FC<GroupCreatePageProps> = (props) => {
    return <div className="createGroupPage page">
        <PageTitle>Create new group</PageTitle>
        <GroupCreateForm addCreatorToGroup redirect="newgroup" />
    </div>
};
