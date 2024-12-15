import puppeteer from "puppeteer-extra"
import { config } from "./config";
import StealthPlugin from "puppeteer-extra-plugin-stealth"

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

puppeteer.use(StealthPlugin());

if (!config.id || !config.token) {
    console.error('Env variables not set');
    process.exit(1);
}

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
    })

    const page = await browser.newPage();
    await page.goto(config.discordUrl);

    console.log("Authorizing discord");
    await page.evaluate((data) => {
        // Setting token in local storage
        const iframe = document.body.appendChild(document.createElement('iframe'));

        if (iframe.contentWindow) {
            iframe.contentWindow.localStorage.token = `"${data.token}"`;
            iframe.contentWindow.localStorage.tokens = JSON.stringify({ [`${data.id}`]: `${data.token}` });
        }
    }, { token: config.token, id: config.id });

    await page.goto(config.discordAuthUrl);

    await page.waitForSelector('button.lookFilled_dd4f85.colorBrand_dd4f85');
    await page.click('.button_dd4f85.lookFilled_dd4f85.colorBrand_dd4f85.sizeMedium_dd4f85.grow_dd4f85');

    console.log('Successfully authorized discord');
    await page.waitForNavigation();
    await delay(3000);
    await page.goto(config.topGGUrl);

    await page.waitForSelector('.chakra-button');

    console.log('Waiting for vote button to be enabled');
    await page.waitForFunction(() => {
        const buttons = Array.from(document.querySelectorAll('.chakra-button'));
        const button = buttons.find(button => button.textContent === 'Vote') as HTMLButtonElement;

        return button && !button.disabled;
    })

    console.log('Clicking button');
    await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('.chakra-button'));
        const button = buttons.find(button => button.textContent === 'Vote') as HTMLButtonElement;
        button.click();
    });

    await browser.close();
    console.log('Successfully voted');

    process.exit(0);
})();
