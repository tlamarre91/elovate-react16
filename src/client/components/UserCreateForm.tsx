import React from "react";
import { Formik } from "formik";

import * as Api from "~shared/api";
import { log } from "~shared/log";
import { UserDto } from "~shared/model/data-transfer-objects";

export interface UserCreateFormProps {
}

export interface UserCreateFormValues {
}

export const UserCreateForm: React.FC<UserCreateFormProps> = (props) => {
    return <div>placeholder</div>;
    //    const onSubmit = (values: UserCreateFormValues) => {
    //    }
    //
    //    return <div className="userCreateForm">
    //        <Formik onSubmit={ onSubmit }>
    //            { props => <div>placeholder</div> }
    //        </Formik>
    //    </div>
}
