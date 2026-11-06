import { test, expect } from '../../fixtures/hotel';
import { searchData } from '../../test-data/hotel';
import { SelectPage } from '../../pages/SelectPage';

test('SELECT-01 must select a hotel', async ({ page, search }) => {
  await search.search(searchData());
  await page.locator('#continue').click();
  await expect(page.locator('#radiobutton_span')).toContainText('Please Select a Hotel');
});
test('SELECT-02 @smoke selected hotel details reach booking page', async ({ page, search }) => {
  const data = searchData();
  await search.search(data); await new SelectPage(page).continue();
  await expect(page.locator('#hotel_name_dis')).toHaveValue(data.hotel);
  await expect(page.locator('#location_dis')).toHaveValue(data.location);
  await expect(page.locator('#room_type_dis')).toHaveValue(data.roomType);
});
test('SELECT-03 only one of multiple hotels can be selected', async ({ page, search }) => {
  await search.search(searchData({ hotel: '' }));
  const radios = page.locator('input[type="radio"]');
  await expect(radios).toHaveCount(4);
  await radios.nth(0).check(); await radios.nth(1).check();
  await expect(radios.nth(0)).not.toBeChecked();
  await expect(radios.nth(1)).toBeChecked();
});
test('SELECT-04 cancel returns to search', async ({ page, search }) => {
  await search.search(searchData());
  await page.locator('#cancel').click();
  await expect(page).toHaveURL(/SearchHotel\.php/);
});
