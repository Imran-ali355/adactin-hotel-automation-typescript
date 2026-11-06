import { test, expect } from '../../fixtures/hotel';
import { searchData, dateAfter, type SearchData } from '../../test-data/hotel';
import data from '../../test_Data/search.json';

for (const location of data.locations) {
  test(`SEARCH-01 @ep location ${location}`, async ({ page, search }) => {
    await search.search(searchData({ location }));
    await expect(page).toHaveURL(new RegExp(data.selectionUrl));
    await expect(page.locator('input[id^="location_"]').first()).toHaveValue(location);
  });
}
for (const [field, error] of data.missing) {
  test(`SEARCH-02 @ep missing ${field}`, async ({ page, search }) => {
    await search.search(searchData({ [field as keyof SearchData]: data.emptyValue }));
    await expect(page.locator(`#${error}`)).not.toBeEmpty();
    await expect(page).toHaveURL(new RegExp(data.searchUrl));
  });
}
for (const [field, values] of data.quantityCases) {
  for (const value of values) {
    test(`SEARCH-03 @bva ${field}=${value}`, async ({ page, search }) => {
      await search.search(searchData({ [field as keyof SearchData]: value }));
      await expect(page).toHaveURL(new RegExp(data.selectionUrl));
      await expect(page.locator('input[type="radio"]')).toHaveCount(data.oneResult);
    });
  }
}
test('SEARCH-04 @bva dropdowns prevent values outside supported ranges', async ({ page, search }) => {
  await search.fill(searchData());
  for (const [id, invalid] of data.invalidDropdowns) {
    for (const value of invalid) await expect(page.locator(`#${id} option[value="${value}"]`)).toHaveCount(data.noResults);
  }
});
test('SEARCH-05 @ep optional hotel and room type can be omitted', async ({ page, search }) => {
  await search.search(searchData({ hotel: data.emptyValue, roomType: data.emptyValue }));
  await expect(page).toHaveURL(new RegExp(data.selectionUrl));
  await expect(page.locator('input[type="radio"]')).toHaveCount(data.optionalResults);
});
for (const roomType of data.roomTypes) {
  test(`SEARCH-06 @ep room type ${roomType}`, async ({ page, search }) => {
    await search.search(searchData({ roomType }));
    await expect(page.locator('input[id^="room_type_"]').first()).toHaveValue(roomType);
  });
}
test('SEARCH-07 @bva checkout one day before check-in is rejected', async ({ page, search }) => {
  await search.search(searchData({
    checkIn: dateAfter(data.checkoutBeforeOffsets.checkIn),
    checkOut: dateAfter(data.checkoutBeforeOffsets.checkOut)
  }));
  await expect(page.locator('#checkin_span')).toContainText(data.beforeError);
  await expect(page.locator('#checkout_span')).toContainText(data.afterError);
});
test('SEARCH-08 @bva one-night stay', async ({ page, search }) => {
  await search.search(searchData({
    checkIn: dateAfter(data.oneNightOffsets.checkIn),
    checkOut: dateAfter(data.oneNightOffsets.checkOut)
  }));
  await expect(page).toHaveURL(new RegExp(data.selectionUrl));
  await expect(page.locator('input[id^="no_days_"]').first()).toHaveValue(new RegExp(data.oneNight));
});
test('SEARCH-09 reset restores defaults', async ({ page, search }) => {
  const originalDate = await page.locator('#datepick_in').inputValue();
  await search.fill(searchData(data.resetInput));
  await page.locator('#Reset').click();
  await expect(page.locator('#location')).toHaveValue(data.resetDefaults.location);
  await expect(page.locator('#room_nos')).toHaveValue(data.resetDefaults.rooms);
  await expect(page.locator('#adult_room')).toHaveValue(data.resetDefaults.adults);
  await expect(page.locator('#child_room')).toHaveValue(data.resetDefaults.children);
  await expect(page.locator('#datepick_in')).toHaveValue(originalDate);
});
