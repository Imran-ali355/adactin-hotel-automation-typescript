import { test, expect } from '../../fixtures/hotel';
import { searchData } from '../../test-data/hotel';
import { SelectPage } from '../../pages/SelectPage';
import data from '../../test_Data/selection.json';

test('SELECT-01 must select a hotel', async ({ page, search }) => {
  await search.search(searchData());
  const selection = new SelectPage(page);
  await selection.continueButton.click();
  await expect(selection.selectionError).toContainText(data.hotelRequiredMessage);
});
test('SELECT-02 @smoke selected hotel details reach booking page', async ({ page, search }) => {
  const hotelData = searchData();
  await search.search(hotelData); await new SelectPage(page).continue();
  const selection = new SelectPage(page);
  await expect(selection.hotelName).toHaveValue(hotelData.hotel);
  await expect(selection.location).toHaveValue(hotelData.location);
  await expect(selection.roomType).toHaveValue(hotelData.roomType);
  await expect(page).toHaveURL(new RegExp(data.bookingUrl));
});
test('SELECT-03 only one of multiple hotels can be selected', async ({ page, search }) => {
  await search.search(searchData({ hotel: '' }));
  const radios = new SelectPage(page).hotelOptions;
  await expect(radios).toHaveCount(data.hotelRadioCount);
  await radios.nth(data.firstRadio).check(); await radios.nth(data.secondRadio).check();
  await expect(radios.nth(data.firstRadio)).not.toBeChecked();
  await expect(radios.nth(data.secondRadio)).toBeChecked();
});
test('SELECT-04 cancel returns to search', async ({ page, search }) => {
  await search.search(searchData());
  await new SelectPage(page).cancelButton.click();
  await expect(page).toHaveURL(new RegExp(data.searchUrl));
});
