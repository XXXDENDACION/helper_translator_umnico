require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');

const Spinner = require('./loadingSpinner');
const typografText = require('./typograf');
const TARGET_LANGUAGES  = require("./constants");

const file = require('../source/dirty.json');

const spinner = new Spinner();
const rl = readline.createInterface({ input, output });

const key = process.env.TOKEN;
const folderId = process.env.FOLDER;

const translations = Object.values(file);
const newTranslation = {};
const body = {
    "targetLanguageCode": "de",
    "sourceLanguageCode": "en",
    "texts": translations,
    "folderId": folderId
}

const translate = async (data) => {
    return await axios.post(
      `https://translate.api.cloud.yandex.net/translate/v2/translate`,
      data,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${key}`,
        },
      }
    );
}

const typografy = async (arrayText) => {
    return await typografText(arrayText);
}

const showSpinner = () => {
    console.clear();
    spinner.spin();
}

const stopSpinner = () => {
    spinner.stop();
}

rl.question("Source Language? (default: 'ru')", async (lang) => {
    const allTranslations = [];
    body.sourceLanguageCode = lang.trim() || "ru";

    showSpinner();

    for (let i = 0; i < TARGET_LANGUAGES.length; i++) { // Request for translate every language in constants.js
        const currentLanguage = TARGET_LANGUAGES[i];
        body.targetLanguageCode = currentLanguage;

        spinner.changeText('Translate for ' + currentLanguage);
        const translation = await translate(body);
        allTranslations.push({[currentLanguage]: translation.data.translations.map(item => item.text)});
    }

    spinner.changeText('Typografy all text');
    // call typorafy for all translated languages
    const typografyArray = await typografy(allTranslations);

    typografyArray.forEach(item => {
        const currentLanguage = Object.keys(item)[0];

        Object.keys(file).map((key, index) => {
            newTranslation[key] = item[currentLanguage][index];
        });

        fs.writeFileSync(`./result/result_${currentLanguage}.json`, JSON.stringify(newTranslation), 'utf-8');
    })

    stopSpinner();

    rl.close();
})