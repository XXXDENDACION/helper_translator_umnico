const puppeteer = require('puppeteer');

const typografText = async (arrayText) => {
    const typografyTextArray = [];
    const browser = await puppeteer.launch({ headless: false });
    const context = browser.defaultBrowserContext();
    await context.overridePermissions('https://www.artlebedev.ru/typograf/',['clipboard-read']);
    const page = await browser.newPage();
    await page.goto('https://www.artlebedev.ru/typograf/');
    await Promise.all([
        await page.click('.typograf-setting-a'),
        await page.waitForTimeout(300),
    ])
    await Promise.all([
        await page.click('label[for="use_symbols"]'),
        await page.waitForTimeout(200)
    ])
    await Promise.all([
        await page.click('.typograf-main-a'),
        await page.waitForTimeout(300)
    ])

    const tranform = async (text) => {
        await page.click('.CodeMirror-scroll');
        await page.keyboard.type(text);

        await Promise.all([
            await page.waitForTimeout(400),
            await page.click('button[name="decode"]'),
            await page.waitForTimeout(500)
        ]);

        await Promise.all([
            await page.click('.copy'),
            await page.waitForTimeout(500)
        ])
        const typografy = await page.evaluate(() => navigator.clipboard.readText());

        await page.click('.CodeMirror-scroll');
        await page.keyboard.down('ControlLeft');
        await page.keyboard.down('a');
        await page.keyboard.up('a');
        await page.keyboard.up('ControlLeft');
        await page.keyboard.down('Backspace');
        await page.keyboard.up('Backspace');
        await page.waitForTimeout(200);

        return typografy;
    }

    for (let i = 0; i < arrayText.length; i++) {
        const updatedText = await tranform(arrayText[i]);
        const replaceText = updatedText.replaceAll('&nbsp;',' ');
        typografyTextArray.push(replaceText);
    }

    await browser.close();
    return typografyTextArray;
};

module.exports = typografText;