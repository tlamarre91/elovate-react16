import * as React from "react";
import { Helmet } from "react-helmet";
import context from "~client/context";
import { UserDto } from "~shared/data-transfer-objects";
import { UserCreateForm } from "~client/components/UserCreateForm";

export interface UserRegistrationPageProps {
}

export const UserRegistrationPage: React.FC<UserRegistrationPageProps> = (props) => {
    const { loggedInUser, setLoggedInUser } = React.useContext(context);
    if (loggedInUser) {
        return <div style={{ padding: "20px" }}>
            You are already logged in. 😀 To create users go to ______
        </div>
    } else {
        return <>
        <Helmet>
            <title>register</title>
        </Helmet>
        <UserCreateForm registration redirect="/" onChange={ setLoggedInUser } />
    </>
    }
}
