import { log } from '~shared/log';
import * as Api from '~shared/api';
import { GroupDto } from '~shared/data-transfer-objects';

import {
    GroupCreateFormValues,
    GroupCreateFormErrors,
    GroupEditFormValues,
    GroupEditFormErrors,
} from '~shared/types';

function processQuery(query: string) {
    const id = parseInt(query);
    if (isNaN(id)) {
        throw new Error(
            `processQuery: can currently only handle numeric IDs :( (got ${query})`,
        );
    } else {
        return `id/${id}`;
    }
}

export async function getOneGroup(query: string): Promise<GroupDto> {
    try {
        const call = new Api.Get<GroupDto>(
            Api.Resource.Group,
            processQuery(query),
        );
        const res = await call.execute();
        if (res.success) {
            return res.data;
        }
        throw new Error(res.error);
    } catch (err) {
        throw err;
    }
}

export async function getManyGroups(query: string): Promise<GroupDto[]> {
    try {
        const call = new Api.Get<GroupDto[]>(Api.Resource.Group, query);
        const res = await call.execute();
        if (res.success) {
            return res.data;
        }
        throw new Error(res.error);
    } catch (err) {
        throw err;
    }
}

export async function validateNewGroup(
    values: GroupCreateFormValues,
): Promise<GroupCreateFormErrors> {
    try {
        const validateCall = new Api.Post<
            GroupCreateFormValues,
            GroupCreateFormErrors
        >(Api.Resource.Group, values, 'validateNew');
        const res = await validateCall.execute();
        if (res.success) {
            return res.data;
        }
        throw new Error(res.error);
    } catch (err) {
        throw err;
    }
}

export async function createNewGroup(
    values: GroupCreateFormValues,
): Promise<GroupDto> {
    try {
        const createCall = new Api.Post<GroupCreateFormValues, GroupDto>(
            Api.Resource.Group,
            values,
        );
        const res = await createCall.execute();
        if (res.success) {
            return res.data;
        }
        throw new Error(res.error);
    } catch (err) {
        throw err;
    }
}

export async function validateUpdateGroup(values: GroupEditFormValues): Promise<GroupEditFormErrors> {
    try {
        const validateCall = new Api.Post<GroupEditFormValues, GroupEditFormErrors>(
            Api.Resource.Group,
            values,
            'validateUpdate',
        );
        const res = await validateCall.execute();
        if (res.success) {
            return res.data;
        }
        throw new Error(res.error);
    } catch (err) {
        throw err;
    }
}

export async function updateGroup(values: GroupEditFormValues): Promise<string> {
    try {
        const updateCall = new Api.Put<GroupEditFormValues, string>(
            Api.Resource.Group,
            values
        );
        const res = await updateCall.execute();
        if (res.success) {
            return res.data;
        }
        throw new Error(res.error);
    } catch (err) {
        throw err;
    }
}
