import { expect, type Page } from '@playwright/test';
export class SelectPage {
  constructor(readonly page: Page) {}
  async continue(index = 0) {
    await this.page.locator('input[type="radio"]').nth(index).check();
    await this.page.locator('#continue').click();
    await expect(this.page).toHaveURL(/BookHotel\.php/);
  }
}
