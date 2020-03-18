import { Builder, By, Key, until, done } from "selenium-webdriver";
import { expect } from "chai";

describe("/register page", () => {
    const driver = new Builder().forBrowser("firefox").build();
    let timestamp = Date.now().toString()
    timestamp = timestamp.slice(timestamp.length - 10, timestamp.length);

    it("should load and show the user registration form", async () => {
        await driver.get("http://localhost:3000/register");
        await driver.sleep(5000);
        expect(await driver.getTitle()).to.equal("register");
        await done();
    });
});
