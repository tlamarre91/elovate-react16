import * as React from 'react';
import * as emailValidator from 'email-validator';
import { Formik } from 'formik';
import * as BP from '@blueprintjs/core';
import { useHistory } from 'react-router-dom';

import { ErrorBoundary as EB } from '~client/components';

import { blacklists, regex } from '~shared/util';

import * as Api from '~shared/api';
import { log } from '~shared/log';
import { GroupDto } from '~shared/data-transfer-objects';

import {
    GroupEditFormValues as Values,
    GroupEditFormErrors as Errors,
} from '~shared/types';

const keys: (keyof Errors)[] = ['name', 'customUrl', 'description'];

export interface GroupEditFormProps {
    group: GroupDto;
}

export const GroupEditForm: React.FC<GroupEditFormProps> = (props) => (
    <div>placeholder</div>
);
