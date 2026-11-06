import { test, expect } from '../../fixtures/hotel';
import { bookingData } from '../../test-data/hotel';
import { ItineraryPage } from '../../pages/ItineraryPage';

test('ITIN-01 find and cancel only the booking created by this test', async ({ page, booking, orders }) => {
  const order = await booking.book(bookingData()); orders.push(order);
  const itinerary = new ItineraryPage(page);
  await itinerary.find(order);
  const button = page.getByRole('button', { name: `Cancel ${order}`, exact: true });
  await expect(button).toHaveCount(1);
  page.once('dialog', dialog => dialog.dismiss());
  await button.click();
  await expect(button).toBeVisible();
  await itinerary.cancel(order);
  orders.splice(orders.indexOf(order), 1);
});
test('ITIN-02 unknown order does not match a booking', async ({ page, search }) => {
  await new ItineraryPage(page).find('ZZNOTFOUND');
  await expect(page.locator('input[id^="btn_id_"]')).toHaveCount(0);
});
test('ITIN-03 @bva order filter limits input to 10 characters', async ({ page, search }) => {
  await page.goto('BookedItinerary.php', { waitUntil: 'domcontentloaded' });
  await page.locator('#order_id_text').fill('A'.repeat(11));
  await expect(page.locator('#order_id_text')).toHaveValue('A'.repeat(10));
});
