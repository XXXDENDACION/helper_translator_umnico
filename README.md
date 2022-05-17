# Node JS Translator

This project helps to automate the translation of locals files and typografy getting the value.

## Technologies

- Node JS
- Puppeteer
- Yandex Cloud
- Typograf by [Art Lebedev](https://www.artlebedev.ru/typograf/)

## Before Run

Before launching, you need to create an account on [Yandex Cloud](https://console.cloud.yandex.ru/) for:
1. [IAM Token](https://cloud.yandex.ru/docs/iam/operations/iam-token/create).
2. [Folder Id](https://cloud.yandex.ru/docs/resource-manager/operations/folder/get-id).

Then create a .env file. It should look like this:
```sh
TOKEN=***your token***
FOLDER=***your folder id***
```

## Run
Put it in `/source/dirty.json` JSON object with localization keys.

Example:
```sh
{
  "6 months": "6 месяцев",
  "6 months price": "54 000 ₽",
  "6 months price 1 month": "9 000 ₽",
  "12 months": "12 месяцев",
  "12 months price": "90 000 ₽",
  "12 months price 1 month": "7 500 ₽",
  "24 months": "24 месяца",
  "24 months price": "156 000 ₽",
  "24 months price 1 month": "6 500 ₽"
}
```

Run `npm run start` in the repo and wait for the script to work.

In the console, select source and target languages.

Open `/source/result.json` after the script completes.

Done! The result can be copied and pasted into the project.

##Development Plan

1. Add target and source language selection from the command.
2. The ability to selectively enable and disable the typografy.
3. The ability to run a printing house separately (It can be useful for processing a large array of text without translation).
