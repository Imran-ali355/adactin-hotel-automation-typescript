import { test, expect } from '../../fixtures/hotel';
import { searchData, dateAfter, type SearchData } from '../../test-data/hotel';
import data from '../../test_Data/search.json';

for (const location of data.locations) {
  test(`SEARCH-01 @ep location ${location}`, async ({ page, search }) => {
    await search.search(searchData({ location }));
    await expect(page).toHaveURL(new RegExp(data.selectionUrl));
    await expect(search.locationResults.first()).toHaveValue(location);
  });
}
for (const [field, error] of data.missing) {
  test(`SEARCH-02 @ep missing ${field}`, async ({ page, search }) => {
    await search.search(searchData({ [field as keyof SearchData]: data.emptyValue }));
    await expect(search.error(error)).not.toBeEmpty();
    await expect(page).toHaveURL(new RegExp(data.searchUrl));
  });
}
for (const [field, values] of data.quantityCases) {
  for (const value of values) {
    test(`SEARCH-03 @bva ${field}=${value}`, async ({ page, search }) => {
      await search.search(searchData({ [field as keyof SearchData]: value }));
      await expect(page).toHaveURL(new RegExp(data.selectionUrl));
      await expect(search.hotelRadios).toHaveCount(data.oneResult);
    });
  }
}
test('SEARCH-04 @bva dropdowns prevent values outside supported ranges', async ({ page, search }) => {
  await search.fill(searchData());
  for (const { id, values } of data.invalidDropdowns) {
    for (const value of values) await expect(search.option(id, value)).toHaveCount(data.noResults);
  }
});
test('SEARCH-05 @ep optional hotel and room type can be omitted', async ({ page, search }) => {
  await search.search(searchData({ hotel: data.emptyValue, roomType: data.emptyValue }));
  await expect(page).toHaveURL(new RegExp(data.selectionUrl));
  await expect(search.hotelRadios).toHaveCount(data.optionalResults);
});
for (const roomType of data.roomTypes) {
  test(`SEARCH-06 @ep room type ${roomType}`, async ({ page, search }) => {
    await search.search(searchData({ roomType }));
    await expect(search.roomTypeResults.first()).toHaveValue(roomType);
  });
}
test('SEARCH-07 @bva checkout one day before check-in is rejected', async ({ page, search }) => {
  await search.search(searchData({
    checkIn: dateAfter(data.checkoutBeforeOffsets.checkIn),
    checkOut: dateAfter(data.checkoutBeforeOffsets.checkOut)
  }));
  await expect(search.error(data.checkInError)).toContainText(data.beforeError);
  await expect(search.error(data.checkOutError)).toContainText(data.afterError);
});
test('SEARCH-08 @bva one-night stay', async ({ page, search }) => {
  await search.search(searchData({
    checkIn: dateAfter(data.oneNightOffsets.checkIn),
    checkOut: dateAfter(data.oneNightOffsets.checkOut)
  }));
  await expect(page).toHaveURL(new RegExp(data.selectionUrl));
  await expect(search.nightsResults.first()).toHaveValue(new RegExp(data.oneNight));
});
test('SEARCH-09 reset restores defaults', async ({ page, search }) => {
  const originalDate = await search.checkInField.inputValue();
  await search.fill(searchData(data.resetInput));
  await search.resetButton.click();
  await expect(search.locationField).toHaveValue(data.resetDefaults.location);
  await expect(search.roomsField).toHaveValue(data.resetDefaults.rooms);
  await expect(search.adultsField).toHaveValue(data.resetDefaults.adults);
  await expect(search.childrenField).toHaveValue(data.resetDefaults.children);
  await expect(search.checkInField).toHaveValue(originalDate);
});
