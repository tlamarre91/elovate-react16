import * as React from "react";
import { Formik } from "formik";

import * as Api from "~shared/api";
import { log } from "~shared/log";
import { UserDto } from "~shared/model/data-transfer-objects";

export interface LoginFormProps {
    redirect?: string;
    errors?: string[];
    values: LoginFormValues;
}

export class LoginFormValues {
    username?: string;
    password?: string;
    ["auth-method"]?: string;
}

export const LoginForm: React.FC<LoginFormProps> = (props) => {
    const [status, setStatus] = React.useState<string>("");
    const onSubmit = (values: LoginFormValues) => {
        log.info(JSON.stringify(values, null, 2));
        const call = new Api.Post<LoginFormValues, UserDto>(window.location.href, Api.Resource.Authentication, values);
        call.execute().then(response => {
            if (response.success) {
                log.info("logged in");
                if (props.redirect) {
                    window.location.replace(props.redirect);
                } else {
                    window.location.reload();
                }
            } else {
                setStatus(response.error);
            }
        });
    }

    return <Formik
        initialValues={ props.values }
        onSubmit={ onSubmit } >
        { props => <form onSubmit={ props.handleSubmit }>
            <input
                type="hidden"
                name="auth-method"
                value={ props.values["auth-method"] }
            />
            <label htmlFor="username">Username</label>
            <input
                type="text"
                onChange= { props.handleChange }
                name="username"
                value={ props.values.username }
            />
            <label htmlFor="password">Password</label>
            <input
                type="password"
                onChange= { props.handleChange }
                name="password"
                value={ props.values.password }
            />
            <button type="submit">log in</button>
            { status ? <div className="status">{ status }</div> : null }
        </form> }
        </Formik>

}
