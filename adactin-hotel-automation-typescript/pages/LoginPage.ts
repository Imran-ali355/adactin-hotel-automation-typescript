import { expect, type Page } from '@playwright/test';
export class LoginPage {
  constructor(readonly page: Page) {}
  async open() { await this.page.goto('index.php', { waitUntil: 'domcontentloaded' }); }
  async login(username: string, password: string) {
    await this.page.locator('#username').fill(username);
    await this.page.locator('#password').fill(password);
    await this.page.locator('#login').click();
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
    await this.page.getByRole('link', { name: 'Logout', exact: true }).click();
    await expect(this.page).toHaveURL(/Logout\.php/);
  }
}
