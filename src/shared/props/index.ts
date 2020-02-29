/**
 * serializable representations of entities to pass through API
 */
export interface EntityProps {
    id?: number;
}

export interface UserProps extends EntityProps {
    username: string;
    email: string;
    displayName?: string;
    hasAccount?: boolean;
    avatarAssetUrl?: string;
}

export interface GroupProps extends EntityProps {
    name: string;
}

export interface MatchProps extends EntityProps {
}

export interface GameProps extends EntityProps {
    name: string;
}

