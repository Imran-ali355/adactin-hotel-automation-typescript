import { expect, type Page } from '@playwright/test';
export class ItineraryPage {
  constructor(readonly page: Page) {}
  get orderFilter() { return this.page.locator('#order_id_text'); }
  get searchButton() { return this.page.locator('#search_hotel_id'); }
  get bookingButtons() { return this.page.locator('input[id^="btn_id_"]'); }
  orderCancelButton(order: string) { return this.page.getByRole('button', { name: `Cancel ${order}`, exact: true }); }
  async find(order: string) {
    // Search first; never cancel or select unrelated bookings on a shared account.
    await this.page.goto('BookedItinerary.php', { waitUntil: 'domcontentloaded' });
    await this.orderFilter.fill(order);
    await this.searchButton.click();
  }
  async cancel(order: string) {
    await this.find(order);
    const button = this.orderCancelButton(order);
    await expect(button).toBeVisible();
    this.page.once('dialog', dialog => dialog.accept());
    await button.click();
    await this.find(order);
    await expect(button).toHaveCount(0);
  }
}
