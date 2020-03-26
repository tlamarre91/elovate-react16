// TODO: rename back to LoginForm... :\
import * as React from 'react';
import { Formik } from 'formik';
import * as BP from '@blueprintjs/core';
import {
    useHistory,
    useLocation,
} from 'react-router-dom';

import {
    ErrorBoundary as EB,
} from '~client/components';

import appState from '~client/app-state';
import * as Api from '~shared/api';
import { log } from '~shared/log';
import { UserDto } from '~shared/data-transfer-objects';
import { postBasicAuth } from '~client/auth';

export interface LoginDialogProps {
    onUserChange: (user: UserDto) => void;
    modal?: boolean;
    redirect?: string;
    errors?: string[];
}

export class LoginDialogValues {
    username: string;

    password: string;

    ['auth-method']: string;
}

export const LoginDialog: React.FC<LoginDialogProps> = (props) => {
    const [states, setStatus] = React.useState<string>();
    const { loggedInUser, setLoggedInUser } = React.useContext(appState);
    const history = useHistory();
    const submit = async (values: LoginDialogValues) => {
        try {
            const user: UserDto = await postBasicAuth(values.username, values.password);
            setLoggedInUser(user);
            if (props.redirect) {
                history.push(props.redirect);
            }
        } catch (err) {
            setStatus(err);
        }
    };

    const content = (
        <div className="loginDialog">
            <EB>
                <Formik
                    initialValues={{
                        username: '',
                        password: '',
                        'auth-method': 'basic',
                    }}
                    validate={(values: LoginDialogValues) => {
                        const errors: Partial<LoginDialogValues> = {};
                        if (values.username.trim().length === 0) {
                            errors.username = 'Enter a username';
                        }

                        if (values.password.length === 0) {
                            errors.password = 'Enter a password';
                        }

                        return errors;
                    }}
                    onSubmit={submit}
              >
                    { (props) => (
                        <form onSubmit={props.handleSubmit}>
                            <BP.FormGroup
                                label="Username"
                                helperText={props.touched.username && props.errors?.username}
                                labelFor="usernameLoginInput"
                          >
                                <BP.InputGroup
                                    id="usernameLoginInput"
                                    name="username"
                                    leftIcon="user"
                                    onBlur={props.handleBlur}
                                    onChange={props.handleChange}
                                    value={props.values.username}
                              />
                          </BP.FormGroup>
                            <BP.FormGroup
                                label="Password"
                                helperText={props.touched.password && props.errors?.password}
                                labelFor="passwordLoginInput"
                          >
                                <BP.InputGroup
                                    id="passwordLoginInput"
                                    name="password"
                                    leftIcon="lock"
                                    type="password"
                                    onBlur={props.handleBlur}
                                    onChange={props.handleChange}
                                    value={props.values.password}
                              />
                          </BP.FormGroup>
                            <BP.Button id="loginDialogButton" type="submit">Log in</BP.Button>
                      </form>
                    )}
              </Formik>
          </EB>
      </div>
    );

    return content;
};
