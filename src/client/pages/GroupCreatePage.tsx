import * as React from "react";

import { GroupCreateForm } from "~client/components/GroupCreateForm";

export interface GroupCreatePageProps {
}

export const GroupCreatePage: React.FC<GroupCreatePageProps> = (props) => {
    return <GroupCreateForm addCreatorToGroup redirect="newgroup" />
}
