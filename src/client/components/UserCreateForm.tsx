import * as React from 'react';
import * as emailValidator from 'email-validator';
import { Formik } from 'formik';
import * as BP from '@blueprintjs/core';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';

import { blacklists } from '~shared/util';
import * as Api from '~shared/api';
import { log } from '~shared/log';
import { postBasicAuth } from '~client/auth';
import { UserDto } from '~shared/data-transfer-objects';

export interface UserCreateFormValues {
    username: string;
    password: string;
    email: string;
}

type Values = UserCreateFormValues;

const KEYS: (keyof Values)[] = ['username', 'password', 'email'];

export interface UserCreateFormProps {
    onChange?: (user: UserDto) => void;
    registration?: boolean; // TODO: this feels like a bad hack. is this is a bad hack? (https://trello.com/c/XLsTxy3H)
    redirect?: string;
    initialValues?: Values;
}

export const UserCreateForm: React.FC<UserCreateFormProps> = (props) => {
    const history = useHistory();
    const [status, setStatus] = React.useState<string>();
    const [serverErrors, setServerErrors] = React.useState<Partial<Values>>();

    const trySubmit = async (values: Values) => {
        const validateCall = new Api.Post<Values, Partial<Values>>(
            Api.Resource.User,
            values,
            'validateNewUser',
        );
        try {
            const res = await validateCall.execute();
            if (res.success) {
                if (KEYS.some((k) => res.data?.[k])) {
                    return setServerErrors(res.data);
                }
            } else {
                log.warn(res.error);
                setStatus('could not validate form');
            }
        } catch (err) {
            log.error(err);
            setStatus('could not validate form');
        }

        const registerCall = new Api.Post<Values, UserDto>(
            Api.Resource.User,
            values,
            'register',
        );
        try {
            const res = await registerCall.execute();
            if (res.success) {
                if (props?.registration) {
                    try {
                        const user = await postBasicAuth(
                            values.username,
                            values.password,
                        );
                        props?.onChange(user);
                        if (props.redirect) {
                            history.push(props.redirect);
                        }
                    } catch (err) {
                        log.error(`post-registration: ${err}`);
                        setStatus('could not register user');
                    }
                } else {
                    props?.onChange(res.data);
                }
            } else {
                log.error(`UserCreateForm: ${res.error}`);
                setStatus('could not register user');
            }
        } catch (err) {
            log.error(`UserCreateForm: ${err}`);
            setStatus('could not register user');
        }
    };

    const validate = (values: Values) => {
        const errors: Partial<Values> = {};

        if (values.username.length === 0) {
            errors.username = 'Provide a username';
        } else if (blacklists.username.includes(values.username)) {
            errors.username = 'Please choose a different username';
        }

        if (values.password.length === 0) {
            errors.password = 'Provide a password';
        } else if (values.password.length < 5) {
            errors.password = 'Come on, give us a password of at least 5 characters';
        } else if (values.password === 'password') {
            errors.password = 'We\'re not letting you set your password to "password", OK?';
        }

        if (!emailValidator.validate(values.email)) {
            errors.email = 'Enter a valid email address';
        }

        return errors;
    };

    return (
        <div className="userCreateFormContainer">
            <Formik
                initialValues={
                    props?.initialValues ?? {
                        username: '',
                        password: '',
                        email: '',
                    }
                }
                validate={validate}
                onSubmit={trySubmit}
            >
                {(formProps) => (
                    <form
                        className="userCreateForm"
                        onSubmit={formProps.handleSubmit}
                    >
                        <BP.FormGroup
                            label="Username"
                            helperText={
                                (formProps.touched.username
                                    && formProps.errors?.username)
                                || serverErrors?.username
                            }
                            intent={
                                formProps.touched.username
                                && formProps.errors?.username
                                    ? BP.Intent.WARNING
                                    : BP.Intent.NONE
                            }
                            labelFor="usernameInput"
                        >
                            <BP.InputGroup
                                id="usernameInput"
                                name="username"
                                leftIcon="user"
                                onBlur={formProps.handleBlur}
                                onChange={formProps.handleChange}
                                value={formProps.values.username}
                            />
                        </BP.FormGroup>
                        <BP.FormGroup
                            label="Email address"
                            intent={
                                formProps.touched.email
                                && formProps.errors?.email
                                    ? BP.Intent.WARNING
                                    : BP.Intent.NONE
                            }
                            helperText={
                                (formProps.touched.email
                                    && formProps.errors?.email)
                                || serverErrors?.email
                            }
                            labelFor="emailInput"
                        >
                            <BP.InputGroup
                                id="emailInput"
                                name="email"
                                leftIcon="envelope"
                                onBlur={formProps.handleBlur}
                                onChange={formProps.handleChange}
                                value={formProps.values.email}
                            />
                        </BP.FormGroup>
                        <BP.FormGroup
                            label="Password"
                            intent={
                                formProps.touched.password
                                && formProps.errors?.password
                                    ? BP.Intent.WARNING
                                    : BP.Intent.NONE
                            }
                            helperText={
                                (formProps.touched.password
                                    && formProps.errors?.password)
                                || serverErrors?.password
                            }
                            labelFor="passwordInput"
                        >
                            <BP.InputGroup
                                id="passwordInput"
                                name="password"
                                type="password"
                                leftIcon="lock"
                                onBlur={formProps.handleBlur}
                                onChange={formProps.handleChange}
                                value={formProps.values.password}
                            />
                        </BP.FormGroup>
                        {status ? <div className="status">{status}</div> : null}
                        <BP.Button id="userSubmitButton" type="submit">
                            {props?.registration ? 'Register' : 'Create user'}
                        </BP.Button>
                    </form>
                )}
            </Formik>
        </div>
    );
};
