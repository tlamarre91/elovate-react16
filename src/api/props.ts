export abstract class MapsTo<T extends EntityProps> {
    toProps(): T;
}

export interface EntityProps {
    id?: number;
}

export interface UserProps extends EntityProps {
    username: string;
    displayName: string;
    email: string;
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


