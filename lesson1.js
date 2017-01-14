// Запрашиваем библиотеку selenium и сохраняем полезные элементы в переменные для удобства
var webdriver = require("selenium-webdriver"),
    By = webdriver.By,
    until = webdriver.until;

// Инициализируем драйвер для нужного браузера
var driver = new webdriver.Builder()
    .forBrowser("chrome")
    .build();

// Заходим на сайт npmjs
driver.get("https://www.npmjs.com");
// Ищем в поиске "selenium-webdriver"
driver.wait(until.elementLocated(By.id("site-search"))).sendKeys("selenium-webdriver");
// В выпавшем меню кликаем на верхний элемент
driver.wait(until.elementLocated(By.css("div.autocomplete-suggestion"))).click();
// В открывшейся странице ищем сбоку надпись с номером версии
driver.wait(until.elementsLocated(By.css(".sidebar .box li"))).then(function (lis) {
    return lis[1].findElement(By.css("strong")).getText();
}).then(function (text) {
    console.log("Version is " + text);
    if (text.match(/3/)) {
        // Если в номере версии есть цифра "3", вводим ее в поиск
        driver.findElement(By.id("site-search")).sendKeys(text);
        // Смотрим на второй элемент в выпавшем меню
        return driver.wait(until.elementsLocated(By.css(".autocomplete-suggestion-description"))).then(function (items) {
            return items[1].getText()
        }).then(function (text) {
            // Текст из пункта меню
            console.log("Pervert method text is " + text);
        });
    } else {
        // Если номер версии неподходящий, идем на гугл
        console.log("Oh no");
        driver.get("https://google.com");
        // Вводум в гугл запрос
        driver.wait(until.elementLocated(By.id("lst-ib"))).sendKeys("how to tie a tie");
        // Находим текст первой ссылки из выдачи
        return driver.wait(until.elementLocated(By.css("#res div.rc a"))).getText().then(function (text) {
            console.log("Google text is " + text)
        })
    }
}).then(function () {
    // Должно выполниться в конце, независимо от найденного номера версии
    console.log("the end");
}).catch(function (error) {
    // Общий обработчик ошибок
}).then(function () {
    // В конце закрываем браузер
    driver.quit();
});

console.log("Async, motherfucker!");