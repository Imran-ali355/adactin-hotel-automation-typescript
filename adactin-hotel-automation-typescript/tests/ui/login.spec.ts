import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.beforeEach(async ({ page }) => { await new LoginPage(page).open(); });
test('LOGIN-01 @smoke login page controls and title', async ({ page }) => {
  await expect(page).toHaveTitle(/Adactin/);
  for (const id of ['username', 'password', 'login']) await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator('#password')).toHaveAttribute('type', 'password');
});
for (const data of [
  { name: 'both empty', user: '', pass: '', error: '#username_span' },
  { name: 'username empty', user: '', pass: 'invalid', error: '#username_span' },
  { name: 'password empty', user: 'testuser', pass: '', error: '#password_span' },
]) {
  test(`LOGIN-02 @ep ${data.name}`, async ({ page }) => {
    await new LoginPage(page).login(data.user, data.pass);
    await expect(page.locator(data.error)).not.toBeEmpty();
    await expect(page).toHaveURL(/index\.php/);
  });
}
for (const [name, user, pass] of [
  ['unknown user', 'unknown_pw_test_34883', 'invalid'],
  ['wrong password', process.env.ADACTIN_USERNAME || 'testuser', 'wrong-password-928'],
  ['SQL-like input', "' OR '1'='1", "' OR '1'='1"],
  ['whitespace', '   ', '   '],
  ['long input', 'x'.repeat(100), 'x'.repeat(100)],
]) {
  test(`LOGIN-03 @ep ${name} is rejected`, async ({ page }) => {
    await new LoginPage(page).login(user, pass);
    await expect(page.locator('.auth_error')).toContainText('Invalid Login');
    await expect(page).not.toHaveURL(/SearchHotel\.php/);
  });
}
test('LOGIN-04 @smoke valid login and logout', async ({ page }) => {
  test.skip(!process.env.ADACTIN_USERNAME || !process.env.ADACTIN_PASSWORD, 'Set ADACTIN_USERNAME and ADACTIN_PASSWORD to run this test.');
  const login = new LoginPage(page);
  await login.loginAsUser();
  await expect(page.locator('#username_show')).toHaveValue(`Hello ${process.env.ADACTIN_USERNAME}!`);
  await login.logout();
  await page.getByRole('link', { name: 'Click here to login again' }).click();
  await expect(page.locator('#login')).toBeVisible();
});
for (const [name, url] of [['Forgot Password?', 'ForgotPassword.php'], ['New User Register Here', 'Register.php']]) {
  test(`LOGIN-05 navigation to ${url}`, async ({ page }) => {
    await page.getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(url.replace('.', '\\.')));
  });
}
for (const path of ['SearchHotel.php', 'BookedItinerary.php', 'ChangePassword.php']) {
  test(`LOGIN-06 unauthenticated access to ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('#login')).toBeVisible();
  });
}
