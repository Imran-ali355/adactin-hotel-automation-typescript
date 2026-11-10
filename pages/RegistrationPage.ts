import { type Page } from '@playwright/test';

export class RegistrationPage {
  constructor(readonly page: Page) {}
  get submitButton() { return this.page.locator('#Submit'); }
  get resetButton() { return this.page.locator('#Reset'); }
  get emailError() { return this.page.locator('.email_err'); }
  get backToLoginLink() { return this.page.getByRole('link', { name: 'Go back to Login page' }); }
  field(id: string) { return this.page.locator(`#${id}`); }
  error(id: string) { return this.page.locator(`#${id}`); }
  async open() { await this.page.goto('Register.php', { waitUntil: 'domcontentloaded' }); }
}
