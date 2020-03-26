import * as Api from '~shared/api';
import { log } from '~shared/log';
import { UserDto } from '~shared/data-transfer-objects';

export interface BasicAuthValues {
    username: string;
    password: string;
    ['auth-method']: string;
}

export async function postBasicAuth(username: string, password: string): Promise<UserDto> {
    const values = { username, password, 'auth-method': 'basic' };
    const call = new Api.Post<BasicAuthValues, UserDto>(Api.Resource.Authentication, values);
    try {
        const res = await call.execute();
        if (res.success) {
            return res.data;
        }
        throw Error(res.error);
    } catch (err) {
        throw err;
    }
}
