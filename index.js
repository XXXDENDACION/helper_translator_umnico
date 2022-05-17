const fs = require('fs');
require('dotenv').config();
const readline = require('readline');
const { stdin: input, stdout: output } = require('process');
const axios = require('axios');
const file = require('./source/dirty.json');
const typografText = require('./typograf');

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

rl.question("Source Language? (default: 'en')", (lang) => {
    body.sourceLanguageCode = lang.trim() || "en";
    rl.question("Target Language? (default: 'de')", (target) => {
        body.targetLanguageCode = target.trim() || "de";

        axios.post(`https://translate.api.cloud.yandex.net/translate/v2/translate`, body, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${key}`
            }
        })
            .then(async (res) => {
                const newArray = await typografText(res.data.translations.map(translation => translation.text));
                Object.keys(file).map((key, index) => {
                    newTranslation[key] = newArray[index];
                })
                console.log(newTranslation);
                fs.writeFileSync('source/result.json', JSON.stringify(newTranslation), 'utf-8');
            })
            .catch(err => console.log(err.response));

        rl.close();
    })
})