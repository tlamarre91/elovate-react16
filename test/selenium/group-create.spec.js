const { Builder, By, Key, until, } = require("selenium-webdriver")
const assert = require("assert");
const config = require("../config");
const {
    elmtId,
    userProps,
    groupProps,
} = require("../util");

describe("/group/new endpoint", function () {
    const newUser = userProps("g");
    const newGroup = groupProps("t");
    before(function () {

    });
});
