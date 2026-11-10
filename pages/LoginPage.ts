import { expect, type Page } from '@playwright/test';
export class LoginPage {
  constructor(readonly page: Page) {}
  get username() { return this.page.locator('#username'); }
  get password() { return this.page.locator('#password'); }
  get loginButton() { return this.page.locator('#login'); }
  get usernameGreeting() { return this.page.locator('#username_show'); }
  get authenticationError() { return this.page.locator('.auth_error'); }
  get loginAgainLink() { return this.page.getByRole('link', { name: 'Click here to login again' }); }
  field(id: string) { return this.page.locator(`#${id}`); }
  error(id: string) { return this.page.locator(`#${id}`); }
  link(name: string) { return this.page.getByRole('link', { name, exact: true }); }
  async open() { await this.page.goto('index.php', { waitUntil: 'domcontentloaded' }); }
  async login(username: string, password: string) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginButton.click();
  }
  async loginAsUser() {
    const username = process.env.ADACTIN_USERNAME;
    const password = process.env.ADACTIN_PASSWORD;
    if (!username || !password) throw new Error('Set ADACTIN_USERNAME and ADACTIN_PASSWORD in .env or Jenkins credentials.');
    await this.open();
    await this.login(username, password);
    await expect(this.page).toHaveURL(/SearchHotel\.php/);
  }
  async logout() {
    await this.link('Logout').click();
    await expect(this.page).toHaveURL(/Logout\.php/);
  }
}
