import { test, expect } from '../../fixtures/hotel';
import { searchData, dateAfter, type SearchData } from '../../test-data/hotel';

for (const location of ['Sydney', 'Melbourne', 'Brisbane', 'Adelaide', 'London', 'New York', 'Los Angeles', 'Paris']) {
  test(`SEARCH-01 @ep location ${location}`, async ({ page, search }) => {
    await search.search(searchData({ location }));
    await expect(page).toHaveURL(/SelectHotel\.php/);
    await expect(page.locator('input[id^="location_"]').first()).toHaveValue(location);
  });
}
const missing: [keyof SearchData, string][] = [
  ['location', 'location_span'], ['rooms', 'num_room_span'], ['adults', 'adults_room_span'],
  ['checkIn', 'checkin_span'], ['checkOut', 'checkout_span'],
];
for (const [field, error] of missing) {
  test(`SEARCH-02 @ep missing ${field}`, async ({ page, search }) => {
    await search.search(searchData({ [field]: '' }));
    await expect(page.locator(`#${error}`)).not.toBeEmpty();
    await expect(page).toHaveURL(/SearchHotel\.php/);
  });
}
for (const [field, values] of [['rooms', ['1', '2', '9', '10']], ['adults', ['1', '2', '3', '4']], ['children', ['0', '1', '3', '4']]] as const) {
  for (const value of values) {
    test(`SEARCH-03 @bva ${field}=${value}`, async ({ page, search }) => {
      await search.search(searchData({ [field]: value }));
      await expect(page).toHaveURL(/SelectHotel\.php/);
      await expect(page.locator('input[type="radio"]')).toHaveCount(1);
    });
  }
}
test('SEARCH-04 @bva dropdowns prevent values outside supported ranges', async ({ page, search }) => {
  await search.fill(searchData());
  for (const [id, invalid] of [['room_nos', ['0', '11']], ['adult_room', ['0', '5']], ['child_room', ['-1', '5']]] as const) {
    for (const value of invalid) await expect(page.locator(`#${id} option[value="${value}"]`)).toHaveCount(0);
  }
});
test('SEARCH-05 @ep optional hotel and room type can be omitted', async ({ page, search }) => {
  await search.search(searchData({ hotel: '', roomType: '' }));
  await expect(page).toHaveURL(/SelectHotel\.php/);
  await expect(page.locator('input[type="radio"]')).toHaveCount(4);
});
for (const roomType of ['Standard', 'Double', 'Deluxe', 'Super Deluxe']) {
  test(`SEARCH-06 @ep room type ${roomType}`, async ({ page, search }) => {
    await search.search(searchData({ roomType }));
    await expect(page.locator('input[id^="room_type_"]').first()).toHaveValue(roomType);
  });
}
test('SEARCH-07 @bva checkout one day before check-in is rejected', async ({ page, search }) => {
  await search.search(searchData({ checkIn: dateAfter(8), checkOut: dateAfter(7) }));
  await expect(page.locator('#checkin_span')).toContainText('before');
  await expect(page.locator('#checkout_span')).toContainText('after');
});
test('SEARCH-08 @bva one-night stay', async ({ page, search }) => {
  await search.search(searchData({ checkIn: dateAfter(7), checkOut: dateAfter(8) }));
  await expect(page).toHaveURL(/SelectHotel\.php/);
  await expect(page.locator('input[id^="no_days_"]').first()).toHaveValue(/1/);
});
test('SEARCH-09 reset restores defaults', async ({ page, search }) => {
  const originalDate = await page.locator('#datepick_in').inputValue();
  await search.fill(searchData({ rooms: '10', adults: '4', children: '4' }));
  await page.locator('#Reset').click();
  await expect(page.locator('#location')).toHaveValue('');
  await expect(page.locator('#room_nos')).toHaveValue('1');
  await expect(page.locator('#adult_room')).toHaveValue('1');
  await expect(page.locator('#child_room')).toHaveValue('0');
  await expect(page.locator('#datepick_in')).toHaveValue(originalDate);
});
