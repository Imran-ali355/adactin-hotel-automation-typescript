import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { SearchPage } from '../pages/SearchPage';
import { SelectPage } from '../pages/SelectPage';
import { BookingPage } from '../pages/BookingPage';
import { ItineraryPage } from '../pages/ItineraryPage';
import { searchData } from '../test-data/hotel';

type Fixtures = { search: SearchPage; booking: BookingPage; orders: string[] };
export const test = base.extend<Fixtures>({
  search: async ({ page }, use) => {
    await new LoginPage(page).loginAsUser();
    await use(new SearchPage(page));
  },
  booking: async ({ page, search }, use) => {
    await search.search(searchData());
    await new SelectPage(page).continue();
    await use(new BookingPage(page));
  },
  orders: async ({ page }, use) => {
    const orders: string[] = [];
    await use(orders);
    // Cleanup errors fail the test instead of silently hiding leftover data.
    if (orders.length) {
      await new LoginPage(page).loginAsUser();
      for (const order of orders) await new ItineraryPage(page).cancel(order);
    }
  },
});
export { expect };
