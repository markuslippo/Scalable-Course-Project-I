const { test, expect } = require("@playwright/test");

test("Incorrect submission results in incorrect result", async ({ page }) => {
  await page.goto("/");
  await page.locator('textarea').fill('Incorrect test code');
  await page.locator('button', { hasText: 'Submit'}).click();
  await page.locator('.feedback-container').waitFor();
  const feedbackTitle = await page.locator('.feedback-container h1').textContent();
  expect(feedbackTitle).toBe('Incorrect');
});


test("Correct submission results in correct result", async ({ page }) => {
  await page.goto("/");
  await page.locator('textarea').fill(`def hello():  return "Hello"`);
  await page.locator('button', { hasText: 'Submit'}).click();
  await page.locator('.feedback-container').waitFor();
  const feedbackTitle = await page.locator('.feedback-container h1').textContent();
  expect(feedbackTitle).toBe('Correct');
});

test('Correct submission results in correct result, and we can move to the next assignment', async ({ page }) => {
  await page.goto("/");
  const oldTitle = await page.locator('h1.text-white.font-extrabold').textContent();
  await page.locator('textarea').fill(`def hello():  return "Hello"`);
  await page.locator('button', { hasText: 'Submit' }).click();
  await page.locator('.feedback-container').waitFor();
  const feedbackTitle = await page.locator('.feedback-container h1').textContent();
  expect(feedbackTitle).toBe('Correct');
  await page.locator('button', { hasText: 'Next assignment' }).click();
  await page.waitForSelector('h1.text-white.font-extrabold', {
    state: 'visible',
  });
  const newTitle = await page.locator('h1.text-white.font-extrabold').textContent();
  expect(newTitle).not.toBe(oldTitle);
});

test('Correct submission gives 100 points', async ({ page }) => {
  await page.goto("/");
  const oldPoints = await page.locator('nav > span').textContent();
  expect(oldPoints).toBe('0 / 300');
  await page.locator('textarea').fill(`def hello():  return "Hello"`);
  await page.locator('button', { hasText: 'Submit' }).click();
  await page.locator('.feedback-container').waitFor();
  const feedbackTitle = await page.locator('.feedback-container h1').textContent();
  expect(feedbackTitle).toBe('Correct');
  await page.waitForTimeout(1000);
  const newPoints = await page.locator('nav > span').textContent();
  expect(newPoints).toBe('100 / 300');
});