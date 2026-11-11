import { expect, type Page } from '@playwright/test';
export class ItineraryPage {
  constructor(readonly page: Page) {}
  get orderFilter() { return this.page.locator('#order_id_text'); }
  get searchButton() { return this.page.locator('#search_hotel_id'); }
  get bookingButtons() { return this.page.locator('input[id^="btn_id_"]'); }
  orderCancelButton(order: string) { return this.page.getByRole('button', { name: `Cancel ${order}`, exact: true }); }
  async find(order: string) {
    // Search first; never cancel or select unrelated bookings on a shared account.
    if (!this.page.url().includes('BookedItinerary.php')) {
      await this.page.goto('BookedItinerary.php', { waitUntil: 'commit' });
    }
    await this.orderFilter.fill(order);
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'domcontentloaded' }),
      this.searchButton.evaluate((button: HTMLInputElement) => button.click()),
    ]);
  }
  async cancel(order: string) {
    if (!this.page.url().includes('BookedItinerary.php')) await this.find(order);
    const button = this.orderCancelButton(order);
    await expect(button).toBeVisible();
    this.page.once('dialog', dialog => dialog.accept());
    await Promise.all([
      this.page.waitForNavigation({ waitUntil: 'commit' }),
      button.evaluate((element: HTMLInputElement) => element.click()),
    ]);
    await expect(button).toHaveCount(0);
  }
}
