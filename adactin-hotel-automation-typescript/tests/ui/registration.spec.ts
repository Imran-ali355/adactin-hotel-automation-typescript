import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => { await page.goto('Register.php', { waitUntil: 'domcontentloaded' }); });
test('REG-01 @ep empty form validates all mandatory fields', async ({ page }) => {
  await page.locator('#Submit').click();
  for (const id of ['username_span', 'password_span', 're_password_span', 'full_name_span', 'email_add_span', 'captcha_span', 'tnc_span']) {
    await expect(page.locator(`#${id}`)).not.toBeEmpty();
  }
});
for (const [field, error, lengths, minimum] of [
  ['username', 'username_span', [7, 8, 9, 19, 20, 21], 8],
  ['password', 'password_span', [5, 6, 7, 19, 20, 21], 6],
] as const) {
  for (const length of lengths) {
    test(`REG-02 @bva ${field} length ${length}`, async ({ page }) => {
      await page.locator(`#${field}`).fill('a'.repeat(length));
      // Other required fields are empty: this never creates an account.
      await page.locator('#Submit').click();
      await expect(page.locator(`#${field}`)).toHaveValue('a'.repeat(Math.min(length, 20)));
      if (length < minimum) await expect(page.locator(`#${error}`)).toContainText(`minimum ${minimum}`);
      else await expect(page.locator(`#${error}`)).toBeEmpty();
    });
  }
}
test('REG-03 @ep passwords must match', async ({ page }) => {
  await page.locator('#password').fill('Password123!');
  await page.locator('#re_password').fill('Different123!');
  await page.locator('#Submit').click();
  await expect(page.locator('#re_password_span')).toContainText('Do Not Match');
});
for (const email of ['plainaddress', 'test@', '@example.com', 'test@example']) {
  test(`REG-04 @ep invalid email ${email}`, async ({ page }) => {
    await page.locator('#email_add').fill(email);
    await page.locator('#full_name').click();
    await expect(page.locator('.email_err')).toContainText('Invalid email');
    await expect(page.locator('#Submit')).toBeDisabled();
  });
}
test('REG-05 valid email format is accepted without submitting registration', async ({ page }) => {
  await page.locator('#email_add').fill('automation@example.com');
  await page.locator('#full_name').click();
  await expect(page.locator('.email_err')).toBeEmpty();
  await expect(page.locator('#Submit')).toBeEnabled();
});
for (const length of [49, 50, 51]) {
  test(`REG-06 @bva full name length ${length}`, async ({ page }) => {
    await page.locator('#full_name').fill('A'.repeat(length));
    await expect(page.locator('#full_name')).toHaveValue('A'.repeat(Math.min(length, 50)));
  });
}
test('REG-07 reset clears entered values', async ({ page }) => {
  await page.locator('#username').fill('testuser123');
  await page.locator('#password').fill('Password123!');
  await page.locator('#Reset').click();
  await expect(page.locator('#username')).toBeEmpty();
  await expect(page.locator('#password')).toBeEmpty();
});
test('REG-08 back to login', async ({ page }) => {
  await page.getByRole('link', { name: 'Go back to Login page' }).click();
  await expect(page.locator('#login')).toBeVisible();
});
