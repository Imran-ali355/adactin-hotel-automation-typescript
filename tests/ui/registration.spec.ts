import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../../pages/RegistrationPage';
import data from '../../test_Data/registration.json';

test.beforeEach(async ({ page }) => { await new RegistrationPage(page).open(); });
test('REG-01 @ep empty form validates all mandatory fields', async ({ page }) => {
  const registration = new RegistrationPage(page);
  await registration.submitButton.click();
  for (const id of data.emptyRequired) {
    await expect(registration.error(id)).not.toBeEmpty();
  }
});
for (const scenario of data.lengthCases) {
  for (const length of scenario.lengths) {
    test(`REG-02 @bva ${scenario.field} length ${length}`, async ({ page }) => {
      const registration = new RegistrationPage(page);
      await registration.field(scenario.field).fill(data.fillCharacter.repeat(length));
      // Other required fields are empty: this never creates an account.
      await registration.submitButton.click();
      await expect(registration.field(scenario.field)).toHaveValue(data.fillCharacter.repeat(Math.min(length, data.maximumFieldLength)));
      if (length < scenario.minimum) await expect(registration.error(scenario.error)).toContainText(`minimum ${scenario.minimum}`);
      else await expect(registration.error(scenario.error)).toHaveText(data.emptyValue);
    });
  }
}
test('REG-03 @ep passwords must match', async ({ page }) => {
  const registration = new RegistrationPage(page);
  await registration.field('password').fill(data.mismatchPasswords[0]);
  await registration.field('re_password').fill(data.mismatchPasswords[1]);
  await registration.submitButton.click();
  await expect(registration.error('re_password_span')).toContainText(data.mismatchMessage);
});
for (const email of data.invalidEmails) {
  test(`REG-04 @ep invalid email ${email}`, async ({ page }) => {
    const registration = new RegistrationPage(page);
    await registration.field('email_add').fill(email);
    await registration.field('full_name').click();
    await expect(registration.emailError).toContainText(data.invalidEmailMessage);
    await expect(registration.submitButton).toBeDisabled();
  });
}
test('REG-05 valid email format is accepted without submitting registration', async ({ page }) => {
  const registration = new RegistrationPage(page);
  await registration.field('email_add').fill(data.validEmail);
  await registration.field('full_name').click();
  await expect(registration.emailError).toHaveText(data.emptyValue);
  await expect(registration.submitButton).toBeEnabled();
});
for (const length of data.nameLengths) {
  test(`REG-06 @bva full name length ${length}`, async ({ page }) => {
    const registration = new RegistrationPage(page);
    await registration.field('full_name').fill(data.nameCharacter.repeat(length));
    await expect(registration.field('full_name')).toHaveValue(data.nameCharacter.repeat(Math.min(length, data.maximumNameLength)));
  });
}
test('REG-07 reset clears entered values', async ({ page }) => {
  const registration = new RegistrationPage(page);
  await registration.field('username').fill(data.resetUsername);
  await registration.field('password').fill(data.resetPassword);
  await registration.resetButton.click();
  await expect(registration.field('username')).toBeEmpty();
  await expect(registration.field('password')).toBeEmpty();
});
test('REG-08 back to login', async ({ page }) => {
  const registration = new RegistrationPage(page);
  await registration.backToLoginLink.click();
  await expect(registration.field(data.loginInput)).toBeVisible();
});
