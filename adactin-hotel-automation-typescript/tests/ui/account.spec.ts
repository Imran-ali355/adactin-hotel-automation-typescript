import { test, expect } from '../../fixtures/hotel';
import { AccountPage } from '../../pages/AccountPage';
import data from '../../test_Data/account.json';

test('ACCOUNT-01 forgot password requires email', async ({ page }) => {
  const account = new AccountPage(page);
  await account.openRecovery();
  await account.submitButton.click();
  await expect(account.recoveryEmailError).toContainText(data.emptyEmailMessage);
});
for (const email of data.invalidEmails) {
  test(`ACCOUNT-02 @ep invalid recovery email ${email}`, async ({ page }) => {
    const account = new AccountPage(page);
    await account.openRecovery();
    await account.recoveryEmail.fill(email);
    await account.recoveryEmail.press('Tab');
    await expect(account.emailError).toContainText(data.invalidEmailMessage);
    await expect(account.submitButton).toBeDisabled();
  });
}
test('ACCOUNT-03 recovery reset clears email', async ({ page }) => {
  const account = new AccountPage(page);
  await account.openRecovery();
  await account.recoveryEmail.fill(data.resetEmail);
  await account.resetButton.click();
  await expect(account.recoveryEmail).toBeEmpty();
});
test('ACCOUNT-04 empty change-password form', async ({ page, search }) => {
  const account = new AccountPage(page);
  await account.openChangePassword();
  await account.submitButton.click();
  for (const id of data.passwordErrors) await expect(account.error(id)).not.toBeEmpty();
});
test('ACCOUNT-05 mismatched new passwords do not submit', async ({ page, search }) => {
  const account = new AccountPage(page);
  await account.openChangePassword();
  await account.currentPassword.fill(data.incorrectCurrentPassword);
  await account.newPassword.fill(data.newPassword);
  await account.repeatedPassword.fill(data.differentPassword);
  await account.submitButton.click();
  await expect(account.confirmationPasswordError).not.toBeEmpty();
});
