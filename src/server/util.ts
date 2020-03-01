import * as Orm from "typeorm";
import { log } from "~server/log";
import * as Entity from "~shared/model/entities";

export async function populateTestData() {
    const TEST_USER_COUNT = 2;
    const TEST_GROUP_COUNT = 5;
    const TEST_MATCH_COUNT = 1000;
    const TEST_GAME_COUNT = 2;

    const BASE_USER_STR = "user_";
    const BASE_GROUP_STR = "group_";
    const BASE_GAME_STR = "game_";

    log.info("populating test data");

    const gameRepo = Orm.getRepository(Entity.Game);
    const games: Array<Entity.Game> = [];
    for (let i = 0; i < TEST_GAME_COUNT; i += 1) {
        const game = gameRepo.create({ name: `${BASE_GAME_STR}${i}` });
        gameRepo.save(game);
        games.push(game);
    }

    //const userRepo = Orm.getCustomRepository(Entity.UserRepository);
    const userRepo = Orm.getRepository(Entity.User);
    const users: Array<Entity.User> = [];
    for (let i = 0; i < TEST_USER_COUNT; i += 1) {
        const username = `${BASE_USER_STR}${i}`;
        const email = `${BASE_USER_STR}${i}@elovate.com`;
        const displayName = `${BASE_USER_STR}${i} display name`;
        //const user = await userRepo.createWithProps({ username, email, displayName });
        const user = userRepo.create({ username, email, displayName });
        userRepo.save(user);
        users.push(user);
    }
}
