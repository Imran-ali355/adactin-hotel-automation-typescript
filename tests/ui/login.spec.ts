import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import data from '../../test_Data/login.json';

test.beforeEach(async ({ page }) => { await page.goto(data.url, { waitUntil: 'domcontentloaded' }); });
test('LOGIN-01 @smoke login page controls and title', async ({ page }) => {
  await expect(page).toHaveTitle(new RegExp(data.titlePattern));
  for (const id of data.fields) await expect(page.locator(`#${id}`)).toBeVisible();
  await expect(page.locator('#password')).toHaveAttribute('type', data.passwordType);
});
for (const scenario of data.emptyCases) {
  test(`LOGIN-02 @ep ${scenario.name}`, async ({ page }) => {
    await new LoginPage(page).login(scenario.user, scenario.pass);
    await expect(page.locator(scenario.error)).not.toBeEmpty();
    await expect(page).toHaveURL(new RegExp(data.url.replace('.', '\\.')));
  });
}
for (const [name, user, pass] of data.invalidCases) {
  const username = name === 'wrong password' ? process.env.ADACTIN_USERNAME || data.invalidUsernameFallback : user;
  const password = pass === 'long' ? data.longInputCharacter.repeat(data.longInputLength) : pass;
  const testedUsername = user === 'long' ? data.longInputCharacter.repeat(data.longInputLength) : username;
  test(`LOGIN-03 @ep ${name} is rejected`, async ({ page }) => {
    await new LoginPage(page).login(testedUsername, password);
    await expect(page.locator('.auth_error')).toContainText(data.invalidMessage);
    await expect(page).not.toHaveURL(new RegExp(data.searchUrl));
  });
}
test('LOGIN-04 @smoke valid login and logout', async ({ page }) => {
  const login = new LoginPage(page);
  await login.loginAsUser();
  await expect(page.locator('#username_show')).toHaveValue(`${data.greetingPrefix}${process.env.ADACTIN_USERNAME}${data.greetingSuffix}`);
  await login.logout();
  await expect(page).toHaveURL(new RegExp(data.logoutUrl));
  await page.getByRole('link', { name: data.loginAgainLink }).click();
  await expect(page.locator('#login')).toBeVisible();
});
for (const [name, url] of [[data.forgotPasswordLink, data.forgotPasswordUrl], [data.registerLink, data.registerUrl]]) {
  test(`LOGIN-05 navigation to ${url}`, async ({ page }) => {
    await page.getByRole('link', { name, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(url));
  });
}
for (const path of data.protectedUrls) {
  test(`LOGIN-06 unauthenticated access to ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.locator('#login')).toBeVisible();
  });
}
