import { type Page } from '@playwright/test';

export class AccountPage {
  constructor(readonly page: Page) {}
  get recoveryEmail() { return this.page.locator('#emailadd_recovery'); }
  get recoveryEmailError() { return this.page.locator('#emailadd_span'); }
  get emailError() { return this.page.locator('.email_err'); }
  get submitButton() { return this.page.locator('#Submit'); }
  get resetButton() { return this.page.locator('#Reset'); }
  get changePasswordLink() { return this.page.getByRole('link', { name: 'Change Password', exact: true }); }
  get currentPassword() { return this.page.locator('#current_pass'); }
  get newPassword() { return this.page.locator('#new_password'); }
  get repeatedPassword() { return this.page.locator('#re_password'); }
  get confirmationPasswordError() { return this.page.locator('#re_pass_span'); }
  field(id: string) { return this.page.locator(`#${id}`); }
  error(id: string) { return this.page.locator(`#${id}`); }
  async openRecovery() { await this.page.goto('ForgotPassword.php', { waitUntil: 'domcontentloaded' }); }
  async openChangePassword() { await this.changePasswordLink.click(); }
}
