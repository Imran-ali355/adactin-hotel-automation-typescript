import { expect, type Page } from '@playwright/test';
export class SelectPage {
  constructor(readonly page: Page) {}
  get continueButton() { return this.page.locator('#continue'); }
  get cancelButton() { return this.page.locator('#cancel'); }
  get selectionError() { return this.page.locator('#radiobutton_span'); }
  get hotelName() { return this.page.locator('#hotel_name_dis'); }
  get location() { return this.page.locator('#location_dis'); }
  get roomType() { return this.page.locator('#room_type_dis'); }
  get hotelOptions() { return this.page.locator('input[type="radio"]'); }
  async continue(index = 0) {
    await this.hotelOptions.nth(index).check();
    await this.continueButton.click();
    await expect(this.page).toHaveURL(/BookHotel\.php/);
  }
}
