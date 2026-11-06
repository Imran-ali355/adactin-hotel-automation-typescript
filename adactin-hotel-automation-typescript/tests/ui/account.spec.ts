import { test, expect } from '../../fixtures/hotel';

test('ACCOUNT-01 forgot password requires email', async ({ page }) => {
  await page.goto('ForgotPassword.php', { waitUntil: 'domcontentloaded' });
  await page.locator('#Submit').click();
  await expect(page.locator('#emailadd_span')).toContainText('Empty');
});
for (const email of ['invalid', 'test@', '@example.com']) {
  test(`ACCOUNT-02 @ep invalid recovery email ${email}`, async ({ page }) => {
    await page.goto('ForgotPassword.php', { waitUntil: 'domcontentloaded' });
    await page.locator('#emailadd_recovery').fill(email);
    await page.locator('#emailadd_recovery').press('Tab');
    await expect(page.locator('.email_err')).toContainText('Invalid email');
    await expect(page.locator('#Submit')).toBeDisabled();
  });
}
test('ACCOUNT-03 recovery reset clears email', async ({ page }) => {
  await page.goto('ForgotPassword.php', { waitUntil: 'domcontentloaded' });
  await page.locator('#emailadd_recovery').fill('automation@example.com');
  await page.locator('#Reset').click();
  await expect(page.locator('#emailadd_recovery')).toBeEmpty();
});
test('ACCOUNT-04 empty change-password form', async ({ page, search }) => {
  await page.getByRole('link', { name: 'Change Password', exact: true }).click();
  await page.locator('#Submit').click();
  for (const id of ['current_pass_span', 'pass_span', 're_pass_span']) await expect(page.locator(`#${id}`)).not.toBeEmpty();
});
test('ACCOUNT-05 mismatched new passwords do not submit', async ({ page, search }) => {
  await page.getByRole('link', { name: 'Change Password', exact: true }).click();
  // Never enter the real current password in a password-changing test.
  await page.locator('#current_pass').fill('deliberately-incorrect-current-password');
  await page.locator('#new_password').fill('TestPassword123!');
  await page.locator('#re_password').fill('DifferentPassword123!');
  await page.locator('#Submit').click();
  await expect(page.locator('#re_pass_span')).not.toBeEmpty();
});
