// doesn't work. will have to do a buttload of finagling 
const Orm = require("typeorm");
const ormconfig = require("./ormconfig-test.json");

const { UserRepository } = require("../dist/server/model/repositories");

async function connectTestDb() {
    try {
        const conn = await Orm.createConnection(ormconfig);
        return conn;
    } catch (err) {
        throw err;
    }
}

const timestamp = Date.now().toString();
timestamp = timestamp.slice(timestamp.length - 10, timestamp.length);

const newUser = {
    username: `user_${timestamp}`,
    password: `password_${timestamp}`,
    email: `email_${timestamp}@test.com`
}

describe("UserRepository", async function () {
    this.timeout(15000);
    let userRepo;
    before(async function() {
        await connectTestDb();
        userRepo = Orm.getCustomRepository(UserRepository);
        console.log("connected");
    });

    describe("validateNewUser", async function() {
        it("should return empty object with valid input", async function () {
            const errors = userRepo.validateNewUser({ username: newUser.username, password: newUser.password, email: newUser.email })
        });
    });
});
