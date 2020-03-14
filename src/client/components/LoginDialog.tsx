import * as React from "react";
import ReactModal from "react-modal";
import { Formik } from "formik";
import {
    useHistory,
    useLocation
} from "react-router-dom";

import * as Api from "~shared/api";
import { log } from "~shared/log";
import { UserDto } from "~shared/model/data-transfer-objects";

export interface LoginDialogProps {
    user: UserDto;
    onChange: (user: UserDto) => void;
    modal?: boolean;
    redirect?: string;
    errors?: string[];
    values: LoginDialogValues;
}

export class LoginDialogValues {
    username?: string;
    password?: string;
    ["auth-method"]?: string;
}

export const LoginDialog: React.FC<LoginDialogProps> = (props) => {
    const location = useLocation();
    const [status, setStatus] = React.useState<string>("");
    const history = useHistory();
    const onSubmit = (values: LoginDialogValues) => {
        log.info(JSON.stringify(values, null, 2));
        const call = new Api.Post<LoginDialogValues, UserDto>(window.location.href, Api.Resource.Authentication, values);
        call.execute().then(res => {
            if (res.success) {
                props.onChange(res.data);
                history.push(props.redirect ?? "/");
            } else {
                setStatus(res.error);
            }
        });
    }

    const goBack = (e: React.MouseEvent) => {
        e.stopPropagation();
        history.goBack();
    }

    const form = <Formik initialValues={ props.values } onSubmit={ onSubmit } >
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


        if (props.modal) {
            const containerStyle: React.CSSProperties = {
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                background: "rgba(0, 0, 0, 0.3)"
            };

            return (
                <div onClick={ goBack } style={ containerStyle }>
                    <div className="loginDialog">
                        { form }
                    </div>
                </div>
            );
        } else {
            return form;
        }
}
