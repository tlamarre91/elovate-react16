import * as React from "react";
import { UserDto } from "~shared/model/data-transfer-objects";
import { UserCreateForm } from "~client/components/UserCreateForm";

export interface UserRegistrationPageProps {
    onChangeLoggedInUser: (user: UserDto) => void;
}

export const UserRegistrationPage: React.FC<UserRegistrationPageProps> = (props) => {
    return <UserCreateForm registration redirect="/" onChange={ (user) => { props.onChangeLoggedInUser(user); } } />
}
