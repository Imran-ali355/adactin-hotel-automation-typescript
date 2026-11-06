import { type Page } from '@playwright/test';
import { type SearchData } from '../test-data/hotel';
export class SearchPage {
  constructor(readonly page: Page) {}
  async fill(data: SearchData) {
    await this.page.locator('#location').selectOption(data.location);
    await this.page.locator('#hotels').selectOption(data.hotel);
    await this.page.locator('#room_type').selectOption(data.roomType);
    await this.page.locator('#room_nos').selectOption(data.rooms);
    await this.page.locator('#datepick_in').fill(data.checkIn);
    await this.page.locator('#datepick_out').fill(data.checkOut);
    await this.page.locator('#adult_room').selectOption(data.adults);
    await this.page.locator('#child_room').selectOption(data.children);
  }
  async submit() { await this.page.locator('#Submit').click(); }
  async search(data: SearchData) { await this.fill(data); await this.submit(); }
}
