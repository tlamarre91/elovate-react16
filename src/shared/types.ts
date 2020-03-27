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
    id: number;
    name: string;
    description: string;
    customUrl: string;
    publicVisible: boolean;
    publicJoinable: boolean;
}

export interface GroupEditFormErrors {
    name?: string;
    id?: string;
    description?: string;
    customUrl?: string;
}
