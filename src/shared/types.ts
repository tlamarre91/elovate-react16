export interface GroupCreateFormValues {
    name: string;
    customUrl: string;
    publicVisible: boolean;
    publicJoinable: boolean;
    addCreatorToGroup: boolean;
}

export interface GroupCreateFormErrors {
    name?: string;
    customUrl?: string;
}

export interface GroupEditFormValues {
    name: string;
    description: string;
    customUrl: string;
    publicVisible: boolean;
    publicJoinable: boolean;
    addCreatorToGroup: boolean;
}

export interface GroupEditFormErrors {
    name?: string;
    description?: string;
    customUrl?: string;
}
