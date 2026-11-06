import { test, expect } from '../../fixtures/hotel';
import { dateAfter, searchData, bookingData } from '../../test-data/hotel';

// These are proposed requirements, not claims about what this demo implements.
// Keep failures visible. Run explicitly with npm run test:requirements.
for (const [name, checkIn, checkOut] of [
  ['same-day stay', dateAfter(7), dateAfter(7)],
  ['past stay', dateAfter(-2), dateAfter(-1)],
  ['impossible calendar date', '31/02/2028', '03/03/2028'],
  ['non-date text', 'abcdefghij', 'klmnopqrst'],
]) {
  test(`REQ-DATE @bva @edge reject ${name}`, async ({ page, search }) => {
    await search.search(searchData({ checkIn, checkOut }));
    await expect(page).toHaveURL(/SearchHotel\.php/);
    await expect(page.locator('#checkin_span, #checkout_span')).not.toHaveText(['', '']);
  });
}
for (const cvv of ['12', '12345', 'abc']) {
  test(`REQ-CVV @bva @ep reject invalid CVV ${cvv}`, async ({ page, booking }) => {
    // Leave first name empty to prevent booking even if the CVV validation is defective.
    await booking.fill(bookingData({ firstName: '', cvv })); await booking.submit();
    await expect(page.locator('#cc_cvv_span')).not.toBeEmpty();
  });
}
test('REQ-CARD @ep reject pasted alphabetic card number', async ({ page, booking }) => {
  await booking.fill(bookingData({ firstName: '', card: 'abcdefghijklmnop' })); await booking.submit();
  await expect(page.locator('#cc_num_span')).not.toBeEmpty();
});
for (const field of ['firstName', 'lastName', 'address'] as const) {
  test(`REQ-SPACE @ep whitespace-only ${field} is invalid`, async ({ page, booking }) => {
    await booking.fill(bookingData({ [field]: '   ', cvv: '' })); await booking.submit();
    const error = { firstName: 'first_name_span', lastName: 'last_name_span', address: 'address_span' }[field];
    await expect(page.locator(`#${error}`)).not.toBeEmpty();
  });
}
