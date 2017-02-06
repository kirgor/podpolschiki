let assert = require("assert");
let _ = require("underscore");

function findMovieItems() {
    return waitForExistMany("#list-page article");
}

function waitForExistMany(selector) {
    $(selector).waitForExist();
    return $$(selector);
}

function waitForVisibleMany(selector) {
    $(selector).waitForVisible();
    return $$(selector);
}

function waitUntilElementReplaced(oldElement) {
    let newElement = null;
    browser.waitUntil(function () {
        newElement = $(oldElement.selector);
        return newElement.value && newElement.value.ELEMENT != oldElement.value.ELEMENT;
    });
    return newElement;
}

describe("Schedule tab at formulakino", function () {
    this.timeout(360000);

    afterEach(function () {
        browser.reload();
    });

    describe("Movies subtab", function () {
        beforeEach(function () {
            browser.url("/raspisanie/kino/");
        });

        describe("Today in cinema", function () {
            it("shows movies list", function () {
                assert(findMovieItems().length > 0, "there are no movie items");
            });

            describe("Movies filter", function () {
                function movieItemsTextsMatch(linkNumber, matcher) {
                    let listPageBeforeClick = $("#list-page");
                    $$("#format_selectors_block a")[linkNumber].click();
                    waitUntilElementReplaced(listPageBeforeClick);

                    _.each($$("#list-page article"), movieItem => {
                        let movieType = movieItem.$$(".prop")[0].$("b");
                        assert(movieType.getText().match(matcher), "movie item text doesn't match the filter");
                    });
                }

                it("filters by 2D format", function () {
                    movieItemsTextsMatch(1, /2D/);
                });

                it("filters by 3D format", function () {
                    movieItemsTextsMatch(2, /3D/);
                });

                it("filters by IMAX format", function () {
                    movieItemsTextsMatch(3, /IMAX/);
                });
            });
        });
    });

    describe("Cinemas subtab", function () {
        beforeEach(function() {
            browser.url("/raspisanie/kinoteatry");
        });

        function getListOfCinemas(cityNumber) {
            let dropDown = $(".tools .selectFixBox");
            $$(".title .top_submenu a")[cityNumber].click();
            dropDown = waitUntilElementReplaced(dropDown);
            browser.scroll(0, 300);
            dropDown.click();
            return waitForVisibleMany(".tools .selectBlock li");
        }

        it("checks cinemas list for certain city", function () {
            assert.equal(getListOfCinemas(1).length - 2, 12, "Wrong number of items");
        });

        it("checks movie names for random cinema", function () {
            let listOfCinemas = getListOfCinemas(_.random(0, 7));
            let listItem = listOfCinemas[_.random(2, listOfCinemas.length - 1)];
            listItem.click();
            let movies = _.filter(waitForExistMany(".cinemas .item"), movie => movie.isVisible());
            _.each(movies, movie => assert(movie.$(".name a").getText() !== "", "Movies don't have names"))
        });
    });
});