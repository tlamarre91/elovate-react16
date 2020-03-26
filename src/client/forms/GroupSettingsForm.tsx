import * as React from 'react';
import { render } from 'react-dom';
import { useFormik } from 'formik';

import * as Api from '~shared/api';

import { elmt } from '~client/util';
import { log } from '~shared/log';

interface GroupSettingsFormProps {
    initialValues: {[key: string]: string};
    groupId: number;
}

export const GroupSettingsForm = (props: GroupSettingsFormProps) => {
    const formik = useFormik({
        initialValues: props.initialValues,
        onSubmit: (values) => {
            log.info(JSON.stringify(values, null, 2));
        },
    });

    return (
      <form onSubmit={formik.handleSubmit}>
            <input
                id="nameInput"
                name="name"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.name}
        />
            <input
                id="customUrlInput"
                name="customUrl"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.customUrl}
        />
            <button type="submit">save settings</button>
        </form>
    );
};
