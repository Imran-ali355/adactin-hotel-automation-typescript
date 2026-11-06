import { test, expect } from '../../fixtures/hotel';
import { bookingData, type BookingData } from '../../test-data/hotel';

const required: [keyof BookingData, string][] = [
  ['firstName', 'first_name_span'], ['lastName', 'last_name_span'], ['address', 'address_span'],
  ['card', 'cc_num_span'], ['cardType', 'cc_type_span'], ['month', 'cc_expiry_span'],
  ['year', 'cc_expiry_span'], ['cvv', 'cc_cvv_span'],
];
for (const [field, error] of required) {
  test(`BOOK-01 @ep required ${field}`, async ({ page, booking }) => {
    await booking.fill(bookingData({ [field]: '' })); await booking.submit();
    await expect(page.locator(`#${error}`)).not.toBeEmpty();
    await expect(page).toHaveURL(/BookHotel\.php/);
  });
}
for (const length of [1, 14, 15]) {
  test(`BOOK-02 @bva card with ${length} digits rejected`, async ({ page, booking }) => {
    await booking.fill(bookingData({ card: '4'.repeat(length) })); await booking.submit();
    await expect(page.locator('#cc_num_span')).toContainText('16 Digit');
  });
}
test('BOOK-03 @bva card input limits entry to 16 digits', async ({ page, booking }) => {
  await booking.fill(bookingData());
  await page.locator('#cc_num').fill('4'.repeat(17));
  await expect(page.locator('#cc_num')).toHaveValue('4'.repeat(16));
});
test('BOOK-04 cancel returns to hotel selection', async ({ page, booking }) => {
  await expect(page.locator('#book_now')).toBeVisible();
  await page.locator('#cancel').click();
  await expect(page).toHaveURL(/SelectHotel\.php/);
});
test('BOOK-05 @smoke booking, confirmation and itinerary', async ({ page, booking, orders }) => {
  const order = await booking.book(bookingData()); orders.push(order);
  await expect(page.getByText('Booking Confirmation', { exact: true })).toBeVisible();
  await expect(page.locator('#hotel_name')).toHaveValue('Hotel Creek');
  await expect(page.locator('#location')).toHaveValue('Sydney');
  await expect(page.locator('#room_type')).toHaveValue('Standard');
  await page.getByRole('button', { name: 'My Itinerary', exact: true }).click();
  await expect(page).toHaveURL(/BookedItinerary\.php/);
  await expect(page.getByRole('button', { name: `Cancel ${order}`, exact: true })).toBeVisible();
});
test('BOOK-06 confirmation search button', async ({ page, booking, orders }) => {
  orders.push(await booking.book(bookingData()));
  await page.getByRole('button', { name: 'Search Hotel', exact: true }).click();
  await expect(page).toHaveURL(/SearchHotel\.php/);
});
