import * as Orm from "typeorm";
import assert from "assert";

import {
    UserRepository
} from ".";


describe("UserRepository", function () {
    this.timeout(2000);

    it("should have a function called validateNewUser", function () {
        assert.ok(Orm.getCustomRepository(UserRepository).validateNewUser);
    });
});
