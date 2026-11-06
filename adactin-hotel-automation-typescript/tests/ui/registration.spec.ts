import { test, expect } from '@playwright/test';
import data from '../../test_Data/registration.json';

test.beforeEach(async ({ page }) => { await page.goto(data.url, { waitUntil: 'domcontentloaded' }); });
test('REG-01 @ep empty form validates all mandatory fields', async ({ page }) => {
  await page.locator(`#${data.submitButton}`).click();
  for (const id of data.emptyRequired) {
    await expect(page.locator(`#${id}`)).not.toBeEmpty();
  }
});
for (const scenario of data.lengthCases) {
  for (const length of scenario.lengths) {
    test(`REG-02 @bva ${scenario.field} length ${length}`, async ({ page }) => {
      await page.locator(`#${scenario.field}`).fill(data.fillCharacter.repeat(length));
      // Other required fields are empty: this never creates an account.
      await page.locator(`#${data.submitButton}`).click();
      await expect(page.locator(`#${scenario.field}`)).toHaveValue(data.fillCharacter.repeat(Math.min(length, data.maximumFieldLength)));
      if (length < scenario.minimum) await expect(page.locator(`#${scenario.error}`)).toContainText(`minimum ${scenario.minimum}`);
      else await expect(page.locator(`#${scenario.error}`)).toHaveText(data.emptyValue);
    });
  }
}
test('REG-03 @ep passwords must match', async ({ page }) => {
  await page.locator('#password').fill(data.mismatchPasswords[0]);
  await page.locator('#re_password').fill(data.mismatchPasswords[1]);
  await page.locator(`#${data.submitButton}`).click();
  await expect(page.locator('#re_password_span')).toContainText(data.mismatchMessage);
});
for (const email of data.invalidEmails) {
  test(`REG-04 @ep invalid email ${email}`, async ({ page }) => {
    await page.locator('#email_add').fill(email);
    await page.locator('#full_name').click();
    await expect(page.locator('.email_err')).toContainText(data.invalidEmailMessage);
    await expect(page.locator(`#${data.submitButton}`)).toBeDisabled();
  });
}
test('REG-05 valid email format is accepted without submitting registration', async ({ page }) => {
  await page.locator('#email_add').fill(data.validEmail);
  await page.locator('#full_name').click();
  await expect(page.locator('.email_err')).toHaveText(data.emptyValue);
  await expect(page.locator(`#${data.submitButton}`)).toBeEnabled();
});
for (const length of data.nameLengths) {
  test(`REG-06 @bva full name length ${length}`, async ({ page }) => {
    await page.locator('#full_name').fill(data.nameCharacter.repeat(length));
    await expect(page.locator('#full_name')).toHaveValue(data.nameCharacter.repeat(Math.min(length, data.maximumNameLength)));
  });
}
test('REG-07 reset clears entered values', async ({ page }) => {
  await page.locator('#username').fill(data.resetUsername);
  await page.locator('#password').fill(data.resetPassword);
  await page.locator(`#${data.resetButton}`).click();
  await expect(page.locator('#username')).toBeEmpty();
  await expect(page.locator('#password')).toBeEmpty();
});
test('REG-08 back to login', async ({ page }) => {
  await page.getByRole('link', { name: data.backLink }).click();
  await expect(page.locator(`#${data.loginInput}`)).toBeVisible();
});
