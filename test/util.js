const {
    url
} = require("./config");

function timestamp() {
    let timestamp = Date.now().toString()
    timestamp = timestamp.slice(timestamp.length - 8, timestamp.length);
    return timestamp;
}

const urls = {
    register: `${url}/register`,
    groups: {
        new: "/groups/new"
    }
};

const elmtId = {
    register: {
        username: "usernameInput",
        email: "emailInput",
        password: "passwordInput",
        submit: "userSubmitButton",
    },
    login: {
        username: "usernameLoginInput",
        password: "passwordLoginInput",
        submit: "loginDialogButton"
    },
    userTag: "loggedInUserTag",
    loginButton: "loginButton",
    logoutButton: "logoutButton",
}

function userProps(tag) {
    const ts = timestamp();
    return {
        username:`user_${tag}_${ts}`,
        password: `password_${tag}_${ts}`,
        email: `email_${tag}_${ts}@elovate.app`
    }
}

function groupProps(tag) {
    const ts = timestamp();
    return {
        name: `group_${tag}_${ts}`,
        customUrl: `customurl_${tag}_${ts}`
    }
}

async function autoNewUser(driver, props) {
    await driver.get(urls.register);
    await driver.sleep(300);
    await driver.findElement(By.id(elmtId.username)).sendKeys(props.username);
    await driver.findElement(By.id(elmtId.email)).sendKeys(props.email);
    await driver.findElement(By.id(elmtId.password)).sendKeys(props.password);
    await driver.findElement(By.id(elmtId.submit)).click();
    await driver.sleep(500);
}

async function autoNewGroup(driver, props) {
    await driver.get(urls.groups.new)
}

exports.urls = urls;
exports.elmtId = elmtId;
exports.userProps = userProps;
exports.groupProps = groupProps;
