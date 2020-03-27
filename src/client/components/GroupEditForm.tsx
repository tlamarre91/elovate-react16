import * as React from 'react';
import * as emailValidator from 'email-validator';
import { Formik } from 'formik';
import * as BP from '@blueprintjs/core';
import { useHistory, useRouteMatch } from 'react-router-dom';

import { ErrorBoundary as EB } from '~client/components';

import { blacklists, regex } from '~shared/util';

import * as Api from '~shared/api';
import { log } from '~shared/log';
import { GroupDto } from '~shared/data-transfer-objects';

import {
    validateUpdateGroup,
    updateGroup
} from '~client/query-runners';

import {
    GroupEditFormValues as Values,
    GroupEditFormErrors as Errors,
} from '~shared/types';

const keys: (keyof Errors)[] = ['name', 'customUrl', 'description'];

export interface GroupEditFormProps {
    group: GroupDto;
    onSuccess: () => void;
}

export const GroupEditForm: React.FC<GroupEditFormProps> = ({ group, onSuccess }) => {
    const history = useHistory();
    const [status, setStatus] = React.useState<string>();
    const [serverErrors, setServerErrors] = React.useState<Errors>();

    log.info(`GroupEditForm editing group: ${JSON.stringify(group, null, 2)}`);
    const goBack = () => history.goBack();

    const trySubmit = async (values: Values) => {
        const keys: (keyof Errors)[] = ['name', 'customUrl', 'description'];
        try {
            const errors = await validateUpdateGroup(values);
            if (keys.some((k) => errors?.[k])) {
                return setServerErrors(errors);
            }
        } catch (err) {
            log.error(`GroupEditForm: ${err}`);
            return setStatus('could not validate form');
        }

        try {
            const result = updateGroup(values);
            onSuccess();
        } catch (err) {
            log.error(`GroupEditForm: ${err}`);
            setStatus('error creating group');
        }
    };

    const validate = (values: Values) => {
        const errors: Partial<Values> = {};
        if (values.name.length === 0) {
            errors.name = 'Provide a group name';
        } else if (blacklists.groupName.includes(values.name)) {
            errors.name = 'Please choose a different name';
        }

        if (values.customUrl.length < 3) {
            errors.customUrl = 'Provide at least 3 characters for custom URL';
        } else if (blacklists.groupCustomUrl.includes(values.customUrl)) {
            errors.customUrl = 'Please choose a different custom URL';
        } else if (
            !values.customUrl.match(regex.alphanumericDashUnderscore128)
        ) {
            errors.customUrl = 'Custom URL may only contain letters, numbers, dash (-) and underscore (_)';
        }

        return errors;
    };

    const initialValues: Values = {
        customUrl: group.customUrl,
        description: group.description,
        id: group.id,
        name: group.name,
        publicJoinable: group.publicJoinable,
        publicVisible: group.publicVisible,
    };

    log.info('juuust about to render');
    return (
        <div className='groupEditFormContainer'>
            <EB>
                <Formik
                    initialValues={initialValues}
                    validate={validate}
                    onSubmit={trySubmit}
                >
                    {(formProps) => (
                        <form
                            className='groupEditForm'
                            onSubmit={formProps.handleSubmit}
                        >
                            <BP.FormGroup
                                label='Group name'
                                helperText={
                                    (formProps.touched.name
                                        && formProps.errors?.name)
                                    || serverErrors?.name
                                }
                                intent={
                                    formProps.touched.name
                                    && formProps.errors?.name
                                        ? BP.Intent.WARNING
                                        : BP.Intent.NONE
                                }
                                labelFor='groupNameInput'
                            >
                                <BP.InputGroup
                                    id='groupNameInput'
                                    name='name'
                                    onBlur={formProps.handleBlur}
                                    onChange={formProps.handleChange}
                                    value={formProps.values.name}
                                />
                            </BP.FormGroup>
                            <BP.FormGroup
                                label='Group description'
                                helperText={
                                    (formProps.touched.description
                                        && formProps.errors?.description)
                                    || serverErrors?.description
                                }
                                intent={
                                    formProps.touched.description && formProps.errors?.name ? BP.Intent.WARNING : BP.Intent.NONE
                                }
                                labelFor='descriptionInput'
                            >
                                <BP.TextArea
                                    growVertically={ true }
                                    name='description'
                                    onBlur={formProps.handleBlur}
                                    onChange={formProps.handleChange}
                                    value={formProps.values.description}
                                />
                            </BP.FormGroup>
                            <BP.FormGroup
                                label='Custom URL'
                                helperText={
                                    (formProps.touched.customUrl
                                        && formProps.errors?.customUrl)
                                    || serverErrors?.customUrl
                                }
                                intent={
                                    formProps.touched.customUrl
                                    && formProps.errors?.customUrl
                                        ? BP.Intent.WARNING
                                        : BP.Intent.NONE
                                }
                                labelFor='customUrlInput'
                            >
                                <BP.InputGroup
                                    id='customUrlInput'
                                    name='customUrl'
                                    onBlur={formProps.handleBlur}
                                    onChange={formProps.handleChange}
                                    value={formProps.values.customUrl}
                                />
                            </BP.FormGroup>
                            <BP.FormGroup
                                inline
                                label='Visible to public'
                                helperText={
                                    formProps.values.publicVisible
                                        ? 'This group will be visible to everyone'
                                        : 'This group can be shared via link'
                                }
                                labelFor='publicVisibleInput'
                            >
                                <BP.Switch
                                    id='publicVisibleInput'
                                    name='publicVisible'
                                    checked={formProps.values.publicVisible}
                                    onChange={formProps.handleChange}
                                />
                            </BP.FormGroup>
                            <BP.FormGroup
                                inline
                                label='Joinable to public'
                                helperText={
                                    formProps.values.publicJoinable
                                        ? 'This group can be joined by anyone'
                                        : 'Users can request an invite or be added by moderators'
                                }
                                labelFor='publicJoinableInput'
                            >
                                <BP.Switch
                                    id='publicJoinableInput'
                                    name='publicJoinable'
                                    checked={formProps.values.publicJoinable}
                                    onChange={formProps.handleChange}
                                />
                            </BP.FormGroup>
                            {status ? (
                                <div className='status'>{status}</div>
                            ) : null}
                            <BP.Button id='groupSubmitButton' type='submit'>
                                Save group
                            </BP.Button>
                            <BP.Button id='cancelButton' type='reset' onClick={ () => {
                                formProps.handleReset();
                                goBack();
                            }}>
                                Cancel changes
                            </BP.Button>
                        </form>
                    )}
                </Formik>
            </EB>
        </div>
    )
};
