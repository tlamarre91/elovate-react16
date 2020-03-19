import * as emailValidator from "email-validator";
import * as React from "react";
import { Formik } from "formik";
import * as BP from "@blueprintjs/core";
import {
    useHistory,
} from "react-router-dom";

import { blacklists } from "~shared/util";
import * as Api from "~shared/api";
import { log } from "~shared/log";
import { postBasicAuth } from "~client/auth";
import { UserDto } from "~shared/model/data-transfer-objects";

export interface GroupCreateFormValues {
    name: string;
    customUrl: string;
    publicVisible: boolean;
    publicJoinable: boolean;
}

type Values = GroupCreateFormValues;

export interface GroupCreateFormErrors {
    name?: string;
    customUrl?: string;
    publicVisible?: string;
    publicJoinable?: string;
}

type Errors = GroupCreateFormErrors;

export interface GroupCreateFormProps {
    initialValues?: GroupCreateFormValues;
}

export const GroupCreateForm: React.FC<GroupCreateFormProps> = (props) => {
    const history = useHistory();
    const [status, setStatus] = React.useState<string>();
    const [serverErrors, setServerErrors] = React.useState<Errors>();

    const trySubmit = async (values: Values) => {
        const validateCall = new Api.Post<GroupCreateFormValues, GroupCreateFormErrors>
            (Api.Resource.Group, values, "validateNewGroup");
        try {
        } catch (err) {
            log // TODO: PERFECT stopping point for the night ;D
        }
    };

    return <div>placeholder</div>
}
