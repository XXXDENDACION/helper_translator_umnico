const puppeteer = require('puppeteer');
const {LANG_TYPOGRAFY}  = require("./constants");

/**
 *
 * @param {Array.<{language: Array.<string>}>} arrayText
 * example: [
 *  { ru: ['text', 'text] }
 *  { en: ['text'] }
 * ]
 * @returns {Promise<*[]>}
 */

const typografText = async (arrayText) => {
    const typografyTextArray = [];
    const browser = await puppeteer.launch({ headless: false });
    const context = browser.defaultBrowserContext();
    await context.overridePermissions('https://www.artlebedev.ru/typograf/',['clipboard-read']);
    const page = await browser.newPage();
    await page.goto('https://www.artlebedev.ru/typograf/');

    await Promise.all([
        await page.click('.typograf-setting-a'),
        await page.waitForTimeout(500),
    ])

    await Promise.all([
        await page.click('label[for="use_symbols"]'),
        await page.waitForTimeout(500)
    ])

    await Promise.all([
        await page.click('.typograf-main-a'),
        await page.waitForTimeout(300)
    ])

    const tranform = async (text) => {
        console.log('.CodeMirror-scroll')
        await page.click('.CodeMirror-scroll');
        await page.keyboard.type(text);

        await page.waitForTimeout(100);
        await page.$eval('button[name="decode"]', el => el.click())

        await page.mainFrame().waitForSelector('.copy');
        await page.waitForTimeout(300);
        await page.click('.copy');

        const typografy = await page.evaluate(() => navigator.clipboard.readText());

        console.log(".CodeMirror-scroll");
        await page.click('.CodeMirror-scroll');
        await page.keyboard.down('ControlLeft');
        await page.keyboard.down('a');
        await page.keyboard.up('a');
        await page.keyboard.up('ControlLeft');
        await page.keyboard.down('Backspace');
        await page.keyboard.up('Backspace');
        await page.waitForTimeout(400);

        return typografy;
    }

    for (let i = 0; i < arrayText.length; i++) {
        const allUpdatedText = [];
        const currentLanguage = Object.keys(arrayText[i])[0];
        const textsOfCurrentLanguage = Object.values(arrayText[i])[0];
        for (let j = 0; j < textsOfCurrentLanguage.length; j++) {
            if (LANG_TYPOGRAFY.find(lang => currentLanguage === lang)) {
                const updatedText = await tranform(textsOfCurrentLanguage[j]);
                const replaceText = updatedText
                    .replaceAll('&nbsp;', ' ')
                    .replaceAll('&laquo;', '«')
                    .replaceAll('&raquo;', '»')
                    .replaceAll('&mdash;', '—')
                    .replaceAll('&bdquo;', '„')
                    .replaceAll('&ldquo;', '“')
                allUpdatedText.push(replaceText);
            } else {
                allUpdatedText.push(textsOfCurrentLanguage[j]);
            }
        }
        const newObject = {[currentLanguage]: allUpdatedText};
        typografyTextArray.push(newObject);
    }

    await browser.close();
    return typografyTextArray;
};

module.exports = typografText;