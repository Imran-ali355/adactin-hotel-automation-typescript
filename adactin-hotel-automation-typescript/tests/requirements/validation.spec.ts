import { test, expect } from '../../fixtures/hotel';
import { dateAfter, searchData, bookingData } from '../../test-data/hotel';
import data from '../../test_Data/requirements.json';

for (const scenario of data.dateCases) {
  const checkIn = 'checkIn' in scenario ? scenario.checkIn : dateAfter(scenario.checkInOffset);
  const checkOut = 'checkOut' in scenario ? scenario.checkOut : dateAfter(scenario.checkOutOffset);
  test(`REQ-DATE @bva @edge reject ${scenario.name}`, async ({ page, search }) => {
    await search.search(searchData({ checkIn, checkOut }));
    await expect(page).toHaveURL(new RegExp(data.searchUrl));
    await expect(page.locator('#checkin_span, #checkout_span')).not.toHaveText(data.emptyMessages);
  });
}
for (const cvv of data.invalidCvv) {
  test(`REQ-CVV @bva @ep reject invalid CVV ${cvv}`, async ({ page, booking }) => {
    await booking.fill(bookingData({ firstName: data.emptyValue, cvv }));
    await booking.submit();
    await expect(page.locator('#cc_cvv_span')).not.toBeEmpty();
  });
}
test('REQ-CARD @ep reject pasted alphabetic card number', async ({ page, booking }) => {
  await booking.fill(bookingData({ firstName: data.emptyValue, card: data.invalidCard }));
  await booking.submit();
  await expect(page.locator('#cc_num_span')).not.toBeEmpty();
});
for (const [field, error] of data.whitespaceFields) {
  test(`REQ-SPACE @ep whitespace-only ${field} is invalid`, async ({ page, booking }) => {
    await booking.fill(bookingData({ [field]: data.whitespace, cvv: data.emptyCvv }));
    await booking.submit();
    await expect(page.locator(`#${error}`)).not.toBeEmpty();
  });
}
