import { test, expect } from '../../fixtures/hotel';
import { searchData } from '../../test-data/hotel';
import { SelectPage } from '../../pages/SelectPage';
import data from '../../test_Data/selection.json';

test('SELECT-01 must select a hotel', async ({ page, search }) => {
  await search.search(searchData());
  await page.locator('#continue').click();
  await expect(page.locator('#radiobutton_span')).toContainText(data.hotelRequiredMessage);
});
test('SELECT-02 @smoke selected hotel details reach booking page', async ({ page, search }) => {
  const hotelData = searchData();
  await search.search(hotelData); await new SelectPage(page).continue();
  await expect(page.locator('#hotel_name_dis')).toHaveValue(hotelData.hotel);
  await expect(page.locator('#location_dis')).toHaveValue(hotelData.location);
  await expect(page.locator('#room_type_dis')).toHaveValue(hotelData.roomType);
  await expect(page).toHaveURL(new RegExp(data.bookingUrl));
});
test('SELECT-03 only one of multiple hotels can be selected', async ({ page, search }) => {
  await search.search(searchData({ hotel: '' }));
  const radios = page.locator('input[type="radio"]');
  await expect(radios).toHaveCount(data.hotelRadioCount);
  await radios.nth(data.firstRadio).check(); await radios.nth(data.secondRadio).check();
  await expect(radios.nth(data.firstRadio)).not.toBeChecked();
  await expect(radios.nth(data.secondRadio)).toBeChecked();
});
test('SELECT-04 cancel returns to search', async ({ page, search }) => {
  await search.search(searchData());
  await page.locator('#cancel').click();
  await expect(page).toHaveURL(new RegExp(data.searchUrl));
});
