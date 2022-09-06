// const puppeteer = require("puppeteer-extra");
require("chromedriver");
let { Builder } = require("selenium-webdriver");

// this should be use only on json reponse url
// note this is initial only

async function getRequest({ url }, toJson = true) {
  let driver = new Builder()
    .forBrowser("chrome")
    .build();
  try {
    await driver.get(url);
    // const data = await driver.findElement("innerHTML");
    const data = await driver.getPageSource();

    console.log(data);

    // const browser = await puppeteer.launch();
    // const [page] = await browser.pages();

    // await page.goto(url, { waitUntil: "networkidle0" });
    // const bodyHTML = await page.evaluate(() => document.body.innerHTML);

    // await browser.close();
    // if (toJson) {
    //   return JSON.parse(bodyHTML);
    // }

    // return bodyHTML;
    return data;
  } catch (err) {
    console.error(err);
  } finally {
    driver.close();
  }
}

module.exports = { getRequest };
