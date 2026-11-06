import { test, expect } from '../../fixtures/hotel';
import data from '../../test_Data/account.json';

test('ACCOUNT-01 forgot password requires email', async ({ page }) => {
  await page.goto(data.forgotPasswordUrl, { waitUntil: 'domcontentloaded' });
  await page.locator(`#${data.submitButton}`).click();
  await expect(page.locator('#emailadd_span')).toContainText(data.emptyEmailMessage);
});
for (const email of data.invalidEmails) {
  test(`ACCOUNT-02 @ep invalid recovery email ${email}`, async ({ page }) => {
    await page.goto(data.forgotPasswordUrl, { waitUntil: 'domcontentloaded' });
    await page.locator('#emailadd_recovery').fill(email);
    await page.locator('#emailadd_recovery').press('Tab');
    await expect(page.locator('.email_err')).toContainText(data.invalidEmailMessage);
    await expect(page.locator('#Submit')).toBeDisabled();
  });
}
test('ACCOUNT-03 recovery reset clears email', async ({ page }) => {
  await page.goto(data.forgotPasswordUrl, { waitUntil: 'domcontentloaded' });
  await page.locator('#emailadd_recovery').fill(data.resetEmail);
  await page.locator(`#${data.resetButton}`).click();
  await expect(page.locator('#emailadd_recovery')).toBeEmpty();
});
test('ACCOUNT-04 empty change-password form', async ({ page, search }) => {
  await page.getByRole('link', { name: data.passwordLink, exact: true }).click();
  await page.locator('#Submit').click();
  for (const id of data.passwordErrors) await expect(page.locator(`#${id}`)).not.toBeEmpty();
});
test('ACCOUNT-05 mismatched new passwords do not submit', async ({ page, search }) => {
  await page.getByRole('link', { name: data.passwordLink, exact: true }).click();
  // Never enter the real current password in a password-changing test.
  await page.locator('#current_pass').fill(data.incorrectCurrentPassword);
  await page.locator('#new_password').fill(data.newPassword);
  await page.locator('#re_password').fill(data.differentPassword);
  await page.locator('#Submit').click();
  await expect(page.locator('#re_pass_span')).not.toBeEmpty();
});
