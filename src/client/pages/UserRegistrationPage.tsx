import * as React from 'react';
import { Helmet } from 'react-helmet';
import appState from '~client/app-state';
import { UserDto } from '~shared/data-transfer-objects';
import { UserCreateForm, PageTitle } from '~client/components';

export interface UserRegistrationPageProps {}

export const UserRegistrationPage: React.FC<UserRegistrationPageProps> = (
    props,
) => {
    const { loggedInUser, setLoggedInUser } = React.useContext(appState);
    if (loggedInUser) {
        return (
            <div style={{ padding: '20px' }}>
            You are already logged in. 😀 To create users go to ______
            </div>
        );
    }
    return (
        <div className="registrationPage page">
            <PageTitle>Register</PageTitle>
            <UserCreateForm
                registration
                redirect="/"
                onChange={setLoggedInUser}
            />
        </div>
    );
};
