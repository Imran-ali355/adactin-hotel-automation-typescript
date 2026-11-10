import { test, expect } from '../../fixtures/hotel';
import { dateAfter, searchData, bookingData } from '../../test-data/hotel';
import data from '../../test_Data/requirements.json';

for (const scenario of data.dateCases) {
  const checkIn = 'checkIn' in scenario ? scenario.checkIn : dateAfter(scenario.checkInOffset);
  const checkOut = 'checkOut' in scenario ? scenario.checkOut : dateAfter(scenario.checkOutOffset);
  test(`REQ-DATE @bva @edge reject ${scenario.name}`, async ({ page, search }) => {
    await search.search(searchData({ checkIn, checkOut }));
    await expect(page).toHaveURL(new RegExp(data.searchUrl));
    for (const id of data.dateErrorFields) await expect(search.error(id)).not.toBeEmpty();
  });
}
for (const cvv of data.invalidCvv) {
  test(`REQ-CVV @bva @ep reject invalid CVV ${cvv}`, async ({ page, booking }) => {
    await booking.fill(bookingData({ firstName: data.emptyValue, cvv }));
    await booking.submit();
    await expect(booking.error(data.cvvErrorField)).not.toBeEmpty();
  });
}
test('REQ-CARD @ep reject pasted alphabetic card number', async ({ page, booking }) => {
  await booking.fill(bookingData({ firstName: data.emptyValue, card: data.invalidCard }));
  await booking.submit();
  await expect(booking.error(data.cardErrorField)).not.toBeEmpty();
});
for (const [field, error] of data.whitespaceFields) {
  test(`REQ-SPACE @ep whitespace-only ${field} is invalid`, async ({ page, booking }) => {
    await booking.fill(bookingData({ [field]: data.whitespace, cvv: data.emptyCvv }));
    await booking.submit();
    await expect(booking.error(error)).not.toBeEmpty();
  });
}
