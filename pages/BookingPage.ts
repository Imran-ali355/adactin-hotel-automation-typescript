import { expect, type Page } from '@playwright/test';
import { type BookingData } from '../test-data/hotel';
export class BookingPage {
  constructor(readonly page: Page) {}
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
  async submit() { await this.page.locator('#book_now').click(); }
  async book(data: BookingData): Promise<string> {
    await this.fill(data); await this.submit();
    await expect(this.page).toHaveURL(/BookingConfirm\.php/, { timeout: 60_000 });
    await expect(this.page.locator('#order_no')).toHaveValue(/\w+/);
    return this.page.locator('#order_no').inputValue();
  }
}
