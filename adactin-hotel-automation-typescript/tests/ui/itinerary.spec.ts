import { test, expect } from '../../fixtures/hotel';
import { bookingData } from '../../test-data/hotel';
import { ItineraryPage } from '../../pages/ItineraryPage';
import data from '../../test_Data/itinerary.json';

test('ITIN-01 find and cancel only the booking created by this test', async ({ page, booking, orders }) => {
  const order = await booking.book(bookingData());
  orders.push(order);
  const itinerary = new ItineraryPage(page);
  await itinerary.find(order);
  const button = page.getByRole('button', { name: `${data.cancelButtonPrefix}${order}`, exact: true });
  await expect(button).toHaveCount(data.oneOrder);
  page.once('dialog', dialog => dialog.dismiss());
  await button.click();
  await expect(button).toBeVisible();
  await itinerary.cancel(order);
  orders.splice(orders.indexOf(order), data.removeCount);
});
test('ITIN-02 unknown order does not match a booking', async ({ page, search }) => {
  await new ItineraryPage(page).find(data.unknownOrder);
  await expect(page.locator('input[id^="btn_id_"]')).toHaveCount(data.noResults);
});
test('ITIN-03 @bva order filter limits input length', async ({ page, search }) => {
  await page.goto(data.unknownUrl, { waitUntil: 'domcontentloaded' });
  await page.locator(`#${data.orderInput}`).fill(data.fillCharacter.repeat(data.orderFillLength));
  await expect(page.locator(`#${data.orderInput}`)).toHaveValue(data.fillCharacter.repeat(data.orderMaxLength));
});
