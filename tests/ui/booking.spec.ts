import { test, expect } from '../../fixtures/hotel';
import { bookingData, type BookingData } from '../../test-data/hotel';
import data from '../../test_Data/booking.json';

for (const [field, error] of data.required) {
  test(`BOOK-01 @ep required ${field}`, async ({ page, booking }) => {
    await booking.fill(bookingData({ [field as keyof BookingData]: '' }));
    await booking.submit();
    await expect(page.locator(`#${error}`)).not.toBeEmpty();
    await expect(page).toHaveURL(new RegExp(data.hotelUrl));
  });
}
for (const length of data.invalidCardLengths) {
  test(`BOOK-02 @bva card with ${length} digits rejected`, async ({ page, booking }) => {
    await booking.fill(bookingData({ card: data.cardPrefix.repeat(length) }));
    await booking.submit();
    await expect(page.locator('#cc_num_span')).toContainText(data.cardError);
  });
}
test('BOOK-03 @bva card input limits entry to its maximum length', async ({ page, booking }) => {
  await booking.fill(bookingData());
  await page.locator('#cc_num').fill(data.cardPrefix.repeat(data.cardInputLength));
  await expect(page.locator('#cc_num')).toHaveValue(data.cardPrefix.repeat(data.cardMaxLength));
});
test('BOOK-04 cancel returns to hotel selection', async ({ page, booking }) => {
  await expect(page.locator('#book_now')).toBeVisible();
  await page.locator('#cancel').click();
  await expect(page).toHaveURL(new RegExp(data.selectionUrl));
});
test('BOOK-05 @smoke booking, confirmation and itinerary', async ({ page, booking, orders }) => {
  const order = await booking.book(bookingData());
  orders.push(order);
  await expect(page.getByText(data.confirmationText, { exact: true })).toBeVisible();
  await expect(page.locator('#hotel_name')).toHaveValue(data.hotel);
  await expect(page.locator('#location')).toHaveValue(data.location);
  await expect(page.locator('#room_type')).toHaveValue(data.roomType);
  await page.getByRole('button', { name: data.itineraryButton, exact: true }).click();
  await expect(page).toHaveURL(new RegExp(data.itineraryUrl));
  await expect(page.getByRole('button', { name: `${data.cancelButtonPrefix}${order}`, exact: true })).toBeVisible();
});
test('BOOK-06 confirmation search button', async ({ page, booking, orders }) => {
  orders.push(await booking.book(bookingData()));
  await page.getByRole('button', { name: data.searchButton, exact: true }).click();
  await expect(page).toHaveURL(new RegExp(data.searchUrl));
});
