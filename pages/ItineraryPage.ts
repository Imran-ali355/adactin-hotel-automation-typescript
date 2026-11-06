import { expect, type Page } from '@playwright/test';
export class ItineraryPage {
  constructor(readonly page: Page) {}
  async find(order: string) {
    // Search first; never cancel or select unrelated bookings on a shared account.
    await this.page.goto('BookedItinerary.php', { waitUntil: 'domcontentloaded' });
    await this.page.locator('#order_id_text').fill(order);
    await this.page.locator('#search_hotel_id').click();
  }
  async cancel(order: string) {
    await this.find(order);
    const button = this.page.getByRole('button', { name: `Cancel ${order}`, exact: true });
    await expect(button).toBeVisible();
    this.page.once('dialog', dialog => dialog.accept());
    await button.click();
    await this.find(order);
    await expect(button).toHaveCount(0);
  }
}
