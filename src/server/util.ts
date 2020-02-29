import * as Orm from "typeorm";
import { log } from "~server/log";
import * as Model from "~server/model";

export async function populateTestData() {
    const TEST_USER_COUNT = 2;
    const TEST_GROUP_COUNT = 5;
    const TEST_MATCH_COUNT = 1000;
    const TEST_GAME_COUNT = 2;

    const BASE_USER_STR = "user_";
    const BASE_GROUP_STR = "group_";
    const BASE_GAME_STR = "game_";

    log.info("populating test data");

    const gameRepo = Orm.getRepository(Model.Game);
    const games: Array<Model.Game> = [];
    for (let i = 0; i < TEST_GAME_COUNT; i += 1) {
        const game = gameRepo.create({ name: `${BASE_GAME_STR}${i}` });
        game.save();
        games.push(game);
    }

    //const userRepo = Orm.getCustomRepository(Model.UserRepository);
    const userRepo = Orm.getRepository(Model.User);
    const users: Array<Model.User> = [];
    for (let i = 0; i < TEST_USER_COUNT; i += 1) {
        const username = `${BASE_USER_STR}${i}`;
        const email = `${BASE_USER_STR}${i}@elovate.com`;
        const displayName = `${BASE_USER_STR}${i} display name`;
        //const user = await userRepo.createWithProps({ username, email, displayName });
        const user = userRepo.create({ username, email, displayName });
        user.save();
        users.push(user);
    }
}
