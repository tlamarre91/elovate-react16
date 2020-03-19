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
import { UserDto } from "~shared/data-transfer-objects";

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
}

type Errors = GroupCreateFormErrors;

const KEYS: (keyof Errors)[] = ["name", "customUrl"];

export interface GroupCreateFormProps {
    initialValues?: GroupCreateFormValues;
    redirect?: string;
}

export const GroupCreateForm: React.FC<GroupCreateFormProps> = (props) => {
    const history = useHistory();
    const [status, setStatus] = React.useState<string>();
    const [serverErrors, setServerErrors] = React.useState<Errors>();

    const trySubmit = async (values: Values) => {
        const validateCall = new Api.Post<Values, Errors>
            (Api.Resource.Group, values, "validateNewGroup");
        try {
            const res = await validateCall.execute();
            if (res.success) {
                if (KEYS.some(k => res.data?.[k])) {
                    setServerErrors(res.data);
                }
            } else {
                log.warn(`GroupCreate: ${res.error}`);
                setStatus("could not validate form");
            }
        } catch (err) {
            log.warn(`GroupCreate: ${err}`);
            setStatus("could not validate form");
        }
    };

    return <div>placeholder</div>
}
