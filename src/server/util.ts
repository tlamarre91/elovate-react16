import jwt from 'jsonwebtoken';
import * as Orm from 'typeorm';
import { log } from '~shared/log';
import { Group, GroupUser, User } from '~server/model/entities';

export async function clearData() {
    const userGroupRepo = Orm.getRepository(GroupUser);
    userGroupRepo.remove(await userGroupRepo.find());

    const userRepo = Orm.getRepository(User);
    userRepo.remove(await userRepo.find());

    const groupRepo = Orm.getRepository(Group);
    groupRepo.remove(await groupRepo.find());
}

export async function populateTestData() {
    const TEST_USER_COUNT = 2;
    const TEST_GROUP_COUNT = 5;
    const TEST_MATCH_COUNT = 1000;
    const TEST_GAME_COUNT = 2;

    const BASE_USER_STR = 'user_';
    const BASE_GROUP_STR = 'group_';
    const BASE_GAME_STR = 'game_';

    log.info('populating test data');

    const userRepo = Orm.getRepository(User);
    const users: Array<User> = [];
    for (let i = 0; i < TEST_USER_COUNT; i += 1) {
        const username = `${BASE_USER_STR}${i}`;
        const email = `${BASE_USER_STR}${i}@elovate.com`;
        const displayName = `${BASE_USER_STR}${i} display name`;
        const user = userRepo.create({ username, email, displayName });
        userRepo.save(user);
        users.push(user);
    }
}
