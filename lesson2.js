var config = require("./config.json");

var webdriver = require("selenium-webdriver");
var By = webdriver.By;
var until = webdriver.until;
var assert = require("assert");
var _ = require("underscore");

var driver;

describe("Schedule tab at formulakino", function () {
    this.timeout(config.timeout);

    beforeEach(function () {
        driver = new webdriver.Builder()
            .forBrowser(config.browser)
            .build();
    });

    beforeEach(function () {
        return driver.get("http://www.formulakino.ru/raspisanie/kino/");
    });

    afterEach(function () {
        return driver.quit();
    });

    describe("Movies subtab", function () {
        describe("Today in cinema", function () {
            it("shows movies list", function () {
                var movieItemsContainer = driver.wait(until.elementLocated(By.id("list-page")));
                return movieItemsContainer.findElements(By.css("article")).then(function (items) {
                    assert(items.length > 0, "there are no movie items");
                });
            });

            describe("movies filter", function () {
                function movieItemsTextsMatch(linkNumber, matcher) {
                    var removableSection = driver.findElement(By.css("#list-page section"));
                    driver.findElement(By.css("#format_selectors_block a:nth-child(" + linkNumber + ")")).click();
                    driver.wait(until.stalenessOf(removableSection));
                    return driver.findElements(By.css("#list-page article .prop:first-child b")).then(function (items) {
                        var getTextPromises = [];
                        _.each(items, function (item) {
                            getTextPromises.push(item.getText());
                        });

                        return Promise.all(getTextPromises).then(function (texts) {
                            _.each(texts, function (text) {
                                assert(text.match(matcher), "movie item text doesn't match the filter");
                            });
                        });
                    });
                }

                it("filters by 2D format", function () {
                    return movieItemsTextsMatch(2, /2D/);
                });

                it("filters by 3D format", function () {
                    return movieItemsTextsMatch(3, /3D/);
                });

                it("filters by IMAX format", function () {
                    return movieItemsTextsMatch(4, /IMAX/);
                });
            });
        });

        describe("Soon in cinema", function () {
            it("shows movies list");

            describe("movies filter", function () {
                it("filters by 2D format");

                it("filters by subtitle");
            });
        });
    });

    describe("Cinemas subtab", function () {

    });

    describe("Festivals subtab", function () {

    });
});