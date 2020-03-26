import * as React from 'react';
import { Helmet } from 'react-helmet';
import appState from '~client/app-state';
import { UserDto } from '~shared/data-transfer-objects';
import { UserCreateForm } from '~client/components/UserCreateForm';

export interface UserRegistrationPageProps {
}

export const UserRegistrationPage: React.FC<UserRegistrationPageProps> = (props) => {
    const { loggedInUser, setLoggedInUser } = React.useContext(appState);
    if (loggedInUser) {
        return (
            <div style={{ padding: '20px' }}>
            You are already logged in. 😀 To create users go to ______
        </div>
        );
    }
    return (
        <>
        <Helmet>
              <title>register</title>
            </Helmet>
        <UserCreateForm registration redirect="/" onChange={setLoggedInUser} />
      </>
    );
};
