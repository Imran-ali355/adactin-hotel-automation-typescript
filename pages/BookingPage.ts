import { expect, type Page } from '@playwright/test';
import { type BookingData } from '../test-data/hotel';
export class BookingPage {
  constructor(readonly page: Page) {}
  get cardNumber() { return this.page.locator('#cc_num'); }
  get bookButton() { return this.page.locator('#book_now'); }
  get cancelButton() { return this.page.locator('#cancel'); }
  get hotelName() { return this.page.locator('#hotel_name'); }
  get location() { return this.page.locator('#location'); }
  get roomType() { return this.page.locator('#room_type'); }
  get orderNumber() { return this.page.locator('#order_no'); }
  get confirmationTitle() { return this.page.getByText('Booking Confirmation', { exact: true }); }
  get itineraryButton() { return this.page.getByRole('button', { name: 'My Itinerary', exact: true }); }
  get searchButton() { return this.page.getByRole('button', { name: 'Search Hotel', exact: true }); }
  field(id: string) { return this.page.locator(`#${id}`); }
  error(id: string) { return this.page.locator(`#${id}`); }
  cancelOrderButton(order: string) { return this.page.getByRole('button', { name: `Cancel ${order}`, exact: true }); }
  async fill(data: BookingData) {
    await this.page.locator('#first_name').fill(data.firstName);
    await this.page.locator('#last_name').fill(data.lastName);
    await this.page.locator('#address').fill(data.address);
    await this.page.locator('#cc_num').fill(data.card);
    await this.page.locator('#cc_type').selectOption(data.cardType);
    await this.page.locator('#cc_exp_month').selectOption(data.month);
    await this.page.locator('#cc_exp_year').selectOption(data.year);
    await this.page.locator('#cc_cvv').fill(data.cvv);
  }
  async submit() { await this.bookButton.click(); }
  async openItinerary() {
    await this.itineraryButton.evaluate((button: HTMLInputElement) => button.click());
    await this.page.waitForURL('**/BookedItinerary.php', { waitUntil: 'commit' });
  }
  async book(data: BookingData): Promise<string> {
    await this.fill(data); await this.submit();
    await expect(this.page).toHaveURL(/BookingConfirm\.php/, { timeout: 60_000 });
    await expect(this.orderNumber).toHaveValue(/\w+/);
    return this.orderNumber.inputValue();
  }
}
