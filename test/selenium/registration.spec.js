const { Builder, By, Key, until, } = require("selenium-webdriver")
const assert = require("assert");
const config = require("../config");
const {
    elmtId,
    userProps,
    urls
} = require("../util");

const {
    url
} = config;

describe("/register page", async function() {
    this.timeout(15000);
    const driver = new Builder().forBrowser("firefox").build();
    const newUser = userProps("test");

    describe("with VALID input", async function () {
        it("should load and show the user registration page", async function() {
            this.timeout(5000);
            await driver.get(urls.register);
            await driver.sleep(300); // TODO: replace these sleeps with wait(condition)
            const title = await driver.getTitle();

            assert.equal(title, "register - elovate");
        });

        it(`should have a username field (#${elmtId.register.username}) that takes input`, async function() {
            this.timeout(5000);
            const elmt = await driver.findElement(By.id(elmtId.register.username));
            await elmt.sendKeys(newUser.username);
            const text = await elmt.getAttribute("value");

            assert.equal(text, newUser.username);
        });

        it(`should have an email field (#${elmtId.register.email}) that takes input`, async function() {
            this.timeout(5000);
            const elmt = await driver.findElement(By.id(elmtId.register.email));
            await elmt.sendKeys(newUser.email);
            const text = await elmt.getAttribute("value");

            assert.equal(text, newUser.email);
        });

        it(`should have a password field (#${elmtId.register.password}) that takes input`, async function() {
            this.timeout(5000);
            const elmt = await driver.findElement(By.id(elmtId.register.password));
            await elmt.sendKeys(newUser.password);
            const text = await elmt.getAttribute("value");

            assert.equal(text, newUser.password);
        });

        it(`submit button (#${elmtId.register.submit}) should POST to /api/v1/users/register`, async function() {
            this.timeout(2000);
            const elmt = await driver.findElement(By.id(elmtId.register.submit));
            await elmt.click();
            await driver.sleep(500);
        });
    });

    describe("LoggedInUserWidget (after registration)", async function () {
        it(`should show newly created user (#${elmtId.userTag})`, async function () {
            this.timeout(2000);
            const tag = await driver.findElement(By.id(elmtId.userTag));

            assert.equal(await tag.getText(), newUser.username);
        });

        it("should open the user settings menu when clicked", async function () {
            const tag = await driver.findElement(By.id(elmtId.userTag));
            await tag.click();
            await driver.sleep(1000);
            const logoutButton = await driver.findElement(By.id(elmtId.logoutButton));
        });

        it(`log out button (#${elmtId.logoutButton}) should log user out when clicked`, async function () {
            const logoutButton = await driver.findElement(By.id(elmtId.logoutButton));
            await logoutButton.click();
            await driver.sleep(500);

        });

        it(`login button (#${elmtId.loginButton}) should show login dialog when clicked`, async function () {
            const loginButton = await driver.findElement(By.id(elmtId.loginButton));
            await loginButton.click();
            await driver.sleep(300);
        });
    });

    describe("LoginDialog (after registration)", async function() {
        it(`should have inputs (${elmtId.login.username}, ${elmtId.login.password})`, async function () {
            await driver.findElement(By.id(elmtId.login.username)).sendKeys(newUser.username);
            await driver.findElement(By.id(elmtId.login.password)).sendKeys(newUser.password);
        });

        it(`should have a submit button (#${elmtId.login.submit}) that posts to /api/v1/authenticate when clicked`, async function () {
            await driver.findElement(By.id(elmtId.login.submit)).click();
            await driver.sleep(200);
            const tag = await driver.findElement(By.id(elmtId.userTag));

            assert.equal(await tag.getText(), newUser.username);
        });
    });


    describe("with INVALID input", async function () {
        it("should load and show the user registration page", async function () {
            this.timeout(5000);
            await driver.get(urls.register);
            await driver.sleep(500);
            const title = await driver.getTitle();

            assert.equal(title, "register - elovate");
        });
    });

    after(async () => {
        return await driver.quit();
    });
});

