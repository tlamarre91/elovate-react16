const { Builder, By, Key, until, } = require("selenium-webdriver")
const assert = require("assert");

describe("/register page", async function() {
    this.timeout(15000);
    const driver = new Builder().forBrowser("firefox").build();
    let timestamp = Date.now().toString()
    timestamp = timestamp.slice(timestamp.length - 10, timestamp.length);

    const newUser = {
        username:`user_${timestamp}`,
        password: `password_${timestamp}`,
        email: `email_${timestamp}@elovate.com`
    }

    const ids = {
        username: "usernameInput",
        email: "emailInput",
        password: "passwordInput",
        submit: "userSubmitButton",
        userTag: "loggedInUserTag",
        loginButton: "loginButton",
        logoutButton: "logoutButton",
        loginUsername: "usernameLoginInput",
        loginPassword: "passwordLoginInput",
        loginDialogButton: "loginDialogButton"
    };

    describe("with VALID input", async function () {
        it("should load and show the user registration page", async function() {
            this.timeout(5000);
            await driver.get("http://localhost:3000/register");
            const title = await driver.getTitle();

            assert.equal(title, "register");
        });

        it(`should have a username field (#${ids.username}) that takes input`, async function() {
            this.timeout(5000);
            const elmt = await driver.findElement(By.id(ids.username));
            await elmt.sendKeys(newUser.username);
            const text = await elmt.getAttribute("value");

            assert.equal(text, newUser.username);
        });

        it(`should have an email field (#${ids.email}) that takes input`, async function() {
            this.timeout(5000);
            const elmt = await driver.findElement(By.id(ids.email));
            await elmt.sendKeys(newUser.email);
            const text = await elmt.getAttribute("value");

            assert.equal(text, newUser.email);
        });

        it(`should have a password field (#${ids.password}) that takes input`, async function() {
            this.timeout(5000);
            const elmt = await driver.findElement(By.id(ids.password));
            await elmt.sendKeys(newUser.password, Key.ENTER);
            const text = await elmt.getAttribute("value");

            assert.equal(text, newUser.password);
        });

        it(`submit button (#${ids.submit}) should POST to /api/v1/users/register then redirect to home`, async function() {
            this.timeout(2000);
            const elmt = await driver.findElement(By.id(ids.submit));
            await elmt.click();
            await driver.sleep(500);

            assert.equal(await driver.getTitle(), "elovate");
        });
    });

    describe("LoggedInUserWidget (after registration)", async function () {
        it(`should show newly created user (#${ids.userTag})`, async function () {
            this.timeout(2000);
            const tag = await driver.findElement(By.id(ids.userTag));

            assert.equal(await tag.getText(), newUser.username);
        });

        it("should open the user settings menu when clicked", async function () {
            const tag = await driver.findElement(By.id(ids.userTag));
            await tag.click();
            await driver.sleep(1000);
            const logoutButton = await driver.findElement(By.id(ids.logoutButton));
        });

        it(`log out button (#${ids.logoutButton}) should log user out when clicked`, async function () {
            const logoutButton = await driver.findElement(By.id(ids.logoutButton));
            await logoutButton.click();
            await driver.sleep(500);

        });

        it(`login button (#${ids.loginButton}) should show login dialog when clicked`, async function () {
            const loginButton = await driver.findElement(By.id(ids.loginButton));
            await loginButton.click();
            await driver.sleep(300);
        });
    });

    describe("LoginDialog (after registration)", async function() {
        it(`should have inputs (${ids.loginUsername}, ${ids.loginPassword})`, async function () {
            await driver.findElement(By.id(ids.loginUsername)).sendKeys(newUser.username);
            await driver.findElement(By.id(ids.loginPassword)).sendKeys(newUser.password);
        });

        it(`should have a submit button (#${ids.loginDialogButton}) that posts to /api/v1/authenticate when clicked`, async function () {
            await driver.findElement(By.id(ids.loginDialogButton)).click();
            await driver.sleep(200);
            const tag = await driver.findElement(By.id(ids.userTag));

            assert.equal(await tag.getText(), newUser.username);
        });
    });


    describe("with INVALID input", async function () {
        it("should load and show the user registration page", async function () {
            this.timeout(5000);
            await driver.get("http://localhost:3000/register");
            const title = await driver.getTitle();
            await driver.sleep(500);

            assert.equal(title, "register");
        });
    });

    after(async () => {
        return await driver.quit();
    });
});

