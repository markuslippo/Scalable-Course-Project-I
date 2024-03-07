import { browser } from 'k6/experimental/browser';
import { check } from 'k6';

export const options = {
    scenarios: {
        ui: {
            executor: 'shared-iterations',
            vus: 1,
            iterations: 5,
            options: {
                browser: {
                    type: 'chromium',
                },
            },
        },
    },
};

function generateCode() {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 5; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

export default async function () {
    const page = browser.newPage();
    try {
        await page.goto('http://localhost:7800/');
        await page.locator('textarea').waitFor({ state: 'visible' });
        await page.locator('textarea').click();
        await page.locator('textarea').type(generateCode(), { delay: 20 }); 
        const submitButton = page.locator('button', { hasText: 'Submit'});
        await Promise.all([
            submitButton.click(),
            page.locator('.feedback-container').waitFor(),
        ]);

        await page.locator('.feedback-container h1').textContent();

    } finally {
        await page.close();
    }
}


