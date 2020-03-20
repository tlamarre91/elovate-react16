import * as emailValidator from "email-validator";
import * as React from "react";
import { Formik } from "formik";
import * as BP from "@blueprintjs/core";
import {
    useHistory,
} from "react-router-dom";

import {
    blacklists,
    regex
} from "~shared/util";
import * as Api from "~shared/api";
import { log } from "~shared/log";
import { GroupDto } from "~shared/data-transfer-objects";

export interface GroupCreateFormValues {
    name: string;
    customUrl: string;
    publicVisible: boolean;
    publicJoinable: boolean;
    publicCanRequestJoin: boolean;
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
    onChange?: (group: GroupDto) => void;
    redirect?: "newgroup" | "usergroups";
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
                log.error(`GroupCreate: ${res.error}`);
                setStatus("could not validate form");
            }
        } catch (err) {
            log.error(`GroupCreate: ${err}`);
            setStatus("could not validate form");
        }

        const createCall = new Api.Post<Values, GroupDto>(Api.Resource.Group, values);
        try {
            const res = await createCall.execute();
            if (res.success) {
                props?.onChange(res.data );
                if (props.redirect) {
                    if (props.redirect === "newgroup") {
                        history.push(`/groups/${values?.customUrl ?? res.data.id}`);
                    } else if (props.redirect === "usergroups") {
                        log.error("don't know how to redirect to usergroups yet");
                    }
                }
            } else {
                log.error(`GroupCreate: ${res.error}`);
            }
        } catch (err) {
            log.error(`GroupCreate: ${err}`);
            setStatus("could not create group");
        }
    };

    const validate = (values: Values) => {
        const errors: Partial<Values> = {};
        if (values.name.length === 0) {
            errors.name = "Provide a group name";
        } else if (blacklists.groupName.includes(values.name)) {
            errors.name = "Please choose a different group name";
        }

        if (blacklists.groupCustomUrl.includes(values.customUrl)) {
            errors.customUrl = "Please choose a different custom URL";
        } else if (! regex.alphanumericDashUnderscore256.exec(values.customUrl)) {
            errors.customUrl = "Custom URL may only contain letters, numbers, dash (-) and underscore (_)";
        }

        return errors;
    };

    return (
        <div className="groupCreateFormContainer">
            <Formik
                initialValues={ props?.initialValues ?? {
                    name: "",
                    customUrl: "",
                    publicVisible: true,
                    publicJoinable: false,
                    publicCanRequestJoin: true
                } }
                validate={ validate }
                onSubmit={ trySubmit }>
                { formProps => (
                    <form className="groupCreateForm" onSubmit={ formProps.handleSubmit }>
                        <BP.FormGroup
                            label="Group name"
                            helperText={ formProps.touched.name && formProps.errors?.name
                                || serverErrors?.name }
                            intent={ formProps.touched.name && formProps.errors?.name
                                ? BP.Intent.WARNING
                                : BP.Intent.NONE }
                            labelFor="groupNameInput">
                            <BP.InputGroup
                                id="groupNameInput"
                                name="name"
                                onBlur={ formProps.handleBlur }
                                onChange={ formProps.handleChange }
                                value={ formProps.values.name }
                            />
                        </BP.FormGroup>
                        <BP.FormGroup
                            label="Custom URL"
                            helperText={ formProps.touched.customUrl && formProps.errors?.customUrl
                                || serverErrors?.customUrl }
                            intent={ formProps.touched.customUrl && formProps.errors?.customUrl
                                ? BP.Intent.WARNING
                                : BP.Intent.NONE }
                            labelFor="customUrlInput">
                            <BP.InputGroup
                                id="customUrlInput"
                                name="customUrl"
                                onBlur={ formProps.handleBlur }
                                onChange={ formProps.handleChange }
                                value={ formProps.values.customUrl }
                            />
                        </BP.FormGroup>
                        <BP.FormGroup
                            label="Visible to public"
                            helperText={ formProps.values.publicVisible
                                ? "This group will be visible to everyone"
                                : "This group can be shared via link" }
                            labelFor="publicVisibleInput">
                            <BP.Switch
                                id="publicVisibleInput"
                                checked={ formProps.values.publicVisible }
                                onChange={ formProps.handleChange }
                            />
                        </BP.FormGroup>
                        <BP.FormGroup
                            label="Joinable to public"
                            helperText={ formProps.values.publicJoinable
                                ? "This group can be joined by anyone"
                                : "Only group moderators can add users" }
                            labelFor="publicJoinableInput">
                            <BP.Switch
                                id="publicJoinableInput"
                                checked={ formProps.values.publicJoinable }
                                onChange={ formProps.handleChange }
                            />
                        </BP.FormGroup>
                        <BP.FormGroup
                            label="Public can request to join"
                            disabled={ formProps.values.publicJoinable }
                            helperText={ formProps.values.publicCanRequestJoin
                                ? "Anyone can ask to join this group"
                                : "" }
                            labelFor="publicJoinableInput">
                            <BP.Switch
                                id="publicJoinableInput"
                                checked={ formProps.values.publicJoinable || formProps.values.publicCanRequestJoin }
                                onChange={ formProps.handleChange }
                            />
                        </BP.FormGroup>
                    { status ? <div className="status">{ status }</div> : null }
                    <BP.Button id="groupSubmitButton" type="submit">Create group</BP.Button>
                    </form>
                )}
            </Formik>
        </div>
    )
}
