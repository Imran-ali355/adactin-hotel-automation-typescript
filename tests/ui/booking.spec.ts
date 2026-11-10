import { test, expect } from '../../fixtures/hotel';
import { bookingData, type BookingData } from '../../test-data/hotel';
import data from '../../test_Data/booking.json';

for (const [field, error] of data.required) {
  test(`BOOK-01 @ep required ${field}`, async ({ page, booking }) => {
    await booking.fill(bookingData({ [field as keyof BookingData]: '' }));
    await booking.submit();
    await expect(booking.error(error)).not.toBeEmpty();
    await expect(page).toHaveURL(new RegExp(data.hotelUrl));
  });
}
for (const length of data.invalidCardLengths) {
  test(`BOOK-02 @bva card with ${length} digits rejected`, async ({ page, booking }) => {
    await booking.fill(bookingData({ card: data.cardPrefix.repeat(length) }));
    await booking.submit();
    await expect(booking.error(data.cardErrorField)).toContainText(data.cardError);
  });
}
test('BOOK-03 @bva card input limits entry to its maximum length', async ({ page, booking }) => {
  await booking.fill(bookingData());
  await booking.cardNumber.fill(data.cardPrefix.repeat(data.cardInputLength));
  await expect(booking.cardNumber).toHaveValue(data.cardPrefix.repeat(data.cardMaxLength));
});
test('BOOK-04 cancel returns to hotel selection', async ({ page, booking }) => {
  await expect(booking.bookButton).toBeVisible();
  await booking.cancelButton.click();
  await expect(page).toHaveURL(new RegExp(data.selectionUrl));
});
test('BOOK-05 @smoke booking, confirmation and itinerary', async ({ page, booking, orders }) => {
  const order = await booking.book(bookingData());
  orders.push(order);
  await expect(booking.confirmationTitle).toBeVisible();
  await expect(booking.hotelName).toHaveValue(data.hotel);
  await expect(booking.location).toHaveValue(data.location);
  await expect(booking.roomType).toHaveValue(data.roomType);
  await booking.itineraryButton.click();
  await expect(page).toHaveURL(new RegExp(data.itineraryUrl));
  await expect(booking.cancelOrderButton(order)).toBeVisible();
});
test('BOOK-06 confirmation search button', async ({ page, booking, orders }) => {
  orders.push(await booking.book(bookingData()));
  await booking.searchButton.click();
  await expect(page).toHaveURL(new RegExp(data.searchUrl));
});
