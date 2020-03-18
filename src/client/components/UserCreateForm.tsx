import * as emailValidator from "email-validator";
import * as React from "react";
import { Formik } from "formik";
import * as BP from "@blueprintjs/core";
import {
    useHistory,
    useLocation
} from "react-router-dom";

import { blacklists } from "~shared/util";
import * as Api from "~shared/api";
import { log } from "~shared/log";
import { postBasicAuth } from "~client/auth";
import { UserDto } from "~shared/model/data-transfer-objects";

export interface UserCreateFormProps {
    onChange?: (user: UserDto) => void;
    registration?: boolean; // TODO: this feels like a bad hack. is this is a bad hack? (https://trello.com/c/XLsTxy3H)
    redirect?: string;
}

export interface UserCreateFormValues {
    username: string;
    password: string;
    email: string;
}

export const UserCreateForm: React.FC<UserCreateFormProps> = (props) => {
    const history = useHistory();
    const [status, setStatus] = React.useState<string>();
    const [usernameTimeout, setUsernameTimeout] = React.useState<number>();
    const [passwordTimeout, setPasswordTimeout] = React.useState<number>();
    const [emailTimeout, setEmailTimeout] = React.useState<number>();
    const [serverErrors, setServerErrors] = React.useState<{
        username: string,
        password: string,
        email: string
    }>();

    const submit = (values: UserCreateFormValues) => {
        const call = new Api.Post<Partial<UserDto>, UserDto>
            (Api.Resource.User, values as Partial<UserDto>, "register");
        call.execute().then(async res => {
            if (res.success) {
                if (props?.registration) {
                    postBasicAuth(values.username, values.password).then(user => {
                        log.info("logged in after registration!");
                        props?.onChange(user);
                        if (props.redirect) {
                            history.push(props.redirect);
                        }
                    }).catch(err => {
                        log.warn(`post-registration: ${err}`);
                    });
                } else {
                    props?.onChange(res.data);
                }
            } else {
                log.warn(`UserCreateForm: ${res.error}`);
            }
        }).catch(err => {
            setStatus(err);
        });
    }

    const validate = (values: UserCreateFormValues) => {
        const DELAY = 1000;
        const errors: Partial<UserCreateFormValues> = {};
        window.clearTimeout(usernameTimeout);
        if (values.username.trim().length === 0) {
            errors.username = "Enter a username";
        } else if (blacklists.username.includes(values.username)) {
            errors.username = "Please choose a different username";
        } else {
            //setUsernameTimeout(window.setTimeout(() => {
            //    setServerErrors({ ... serverErrors, username: null });
            //    new Api.Post<{ username: string }, { username: string }>
            //        (Api.Resource.User, { username: values.username }, "validateNewUser").execute()
            //        .then(res => {
            //            if (res.success) {
            //                setServerErrors({ ... serverErrors, username: res.data.username });
            //            } else {
            //                setStatus("could not validate username");
            //            }
            //        }).catch(err => {
            //            log.warn(`username validation check (response): ${err}`);
            //        });
            //}, DELAY));
        }

        if (values.password.length === 0) {
            errors.password = "Enter a password";
        } else if (values.password.length < 5) {
            errors.password = "Come on, give us a password of at least 5 characters";
        } else if (values.password === "password") {
            errors.password = "We're not letting you set your password to \"password\", OK?";
        }

        window.clearTimeout(emailTimeout);
        if (! emailValidator.validate(values.email)) {
            errors.email = "Enter a valid email address";
        } else {
            //setEmailTimeout(window.setTimeout(() => {
            //    new Api.Post<{ email: string}, { email: string }>(
            //        Api.Resource.User,
            //        { email: values.email},
            //        "validateNewUser").execute()
            //        .then(res => {
            //            if (res.success) {
            //                errors.username = res.data.email;
            //            } else {
            //                log.warn(`email validation check (response): ${res.error}`);
            //            }
            //        }).catch((err: Error) => {
            //            log.warn(`email availability check: ${err}`);
            //        });
            //}, DELAY));
        }

        return errors;
    }

    const form = (
        <div className="userCreateForm">
            <Formik
                initialValues={{
                    username: "",
                    password: "",
                    email: ""
                }}
                validate={ validate }
                onSubmit={ submit }>
                { formProps => (
                    <form onSubmit={ formProps.handleSubmit }>
                        <BP.FormGroup 
                            label="Username"
                            helperText={ formProps.touched.username && formProps.errors?.username }
                            intent={ formProps.touched.username && formProps.errors?.username
                                ? BP.Intent.WARNING
                                : BP.Intent.NONE }
                            labelFor="usernameInput">
                            <BP.InputGroup
                                id="usernameInput"
                                name="username"
                                leftIcon="user"
                                onBlur={ formProps.handleBlur }
                                onChange={ formProps.handleChange }
                                value={ formProps.values.username }
                            />
                        </BP.FormGroup>
                        <BP.FormGroup 
                            label="Email address"
                            intent={ formProps.touched.email && formProps.errors?.email
                                ? BP.Intent.WARNING
                                : BP.Intent.NONE }
                            helperText={ formProps.touched.email && formProps.errors?.email }
                            labelFor="emailInput">
                            <BP.InputGroup
                                id="emailInput"
                                name="email"
                                leftIcon="envelope"
                                onBlur={ formProps.handleBlur }
                                onChange={ formProps.handleChange }
                                value={ formProps.values.email }
                            />
                        </BP.FormGroup>
                        <BP.FormGroup 
                            label="Password"
                            intent={ formProps.touched.password && formProps.errors?.password
                                ? BP.Intent.WARNING
                                : BP.Intent.NONE }
                            helperText={ formProps.touched.password && formProps.errors?.password }
                            labelFor="passwordInput">
                            <BP.InputGroup
                                id="passwordInput"
                                name="password"
                                type="password"
                                leftIcon="lock"
                                onBlur={ formProps.handleBlur }
                                onChange={ formProps.handleChange }
                                value={ formProps.values.password }
                            />
                        </BP.FormGroup>
                        { status ? <div className="status">{ status }</div> : null }
                        <BP.Button type="submit">{ props?.registration ? "Register" : "Create user" }</BP.Button>
                    </form>
                )}
            </Formik>
        </div>
    )

    return form;
}
