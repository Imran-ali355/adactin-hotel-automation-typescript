import { type Page } from '@playwright/test';
import { type SearchData } from '../test-data/hotel';
export class SearchPage {
  constructor(readonly page: Page) {}
  get locationResults() { return this.page.locator('input[id^="location_"]'); }
  get hotelRadios() { return this.page.locator('input[type="radio"]'); }
  get roomTypeResults() { return this.page.locator('input[id^="room_type_"]'); }
  get nightsResults() { return this.page.locator('input[id^="no_days_"]'); }
  get locationField() { return this.page.locator('#location'); }
  get roomsField() { return this.page.locator('#room_nos'); }
  get adultsField() { return this.page.locator('#adult_room'); }
  get childrenField() { return this.page.locator('#child_room'); }
  get checkInField() { return this.page.locator('#datepick_in'); }
  get resetButton() { return this.page.locator('#Reset'); }
  error(id: string) { return this.page.locator(`#${id}`); }
  option(id: string, value: string) { return this.page.locator(`#${id} option[value="${value}"]`); }
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
