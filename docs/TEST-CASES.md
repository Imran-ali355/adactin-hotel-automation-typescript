# Discovered test cases

Generated from Playwright test discovery. Discovery is not execution. Browser suites repeat the same UI cases on each browser.

| Project | File | Test |
| --- | --- | --- |
| chromium | ui/account.spec.ts | ACCOUNT-01 forgot password requires email |
| chromium | ui/account.spec.ts | ACCOUNT-02 @ep invalid recovery email invalid |
| chromium | ui/account.spec.ts | ACCOUNT-02 @ep invalid recovery email test@ |
| chromium | ui/account.spec.ts | ACCOUNT-02 @ep invalid recovery email @example.com |
| chromium | ui/account.spec.ts | ACCOUNT-03 recovery reset clears email |
| chromium | ui/account.spec.ts | ACCOUNT-04 empty change-password form |
| chromium | ui/account.spec.ts | ACCOUNT-05 mismatched new passwords do not submit |
| chromium | ui/booking.spec.ts | BOOK-01 @ep required firstName |
| chromium | ui/booking.spec.ts | BOOK-01 @ep required lastName |
| chromium | ui/booking.spec.ts | BOOK-01 @ep required address |
| chromium | ui/booking.spec.ts | BOOK-01 @ep required card |
| chromium | ui/booking.spec.ts | BOOK-01 @ep required cardType |
| chromium | ui/booking.spec.ts | BOOK-01 @ep required month |
| chromium | ui/booking.spec.ts | BOOK-01 @ep required year |
| chromium | ui/booking.spec.ts | BOOK-01 @ep required cvv |
| chromium | ui/booking.spec.ts | BOOK-02 @bva card with 1 digits rejected |
| chromium | ui/booking.spec.ts | BOOK-02 @bva card with 14 digits rejected |
| chromium | ui/booking.spec.ts | BOOK-02 @bva card with 15 digits rejected |
| chromium | ui/booking.spec.ts | BOOK-03 @bva card input limits entry to 16 digits |
| chromium | ui/booking.spec.ts | BOOK-04 cancel returns to hotel selection |
| chromium | ui/booking.spec.ts | BOOK-05 @smoke booking, confirmation and itinerary |
| chromium | ui/booking.spec.ts | BOOK-06 confirmation search button |
| chromium | ui/itinerary.spec.ts | ITIN-01 find and cancel only the booking created by this test |
| chromium | ui/itinerary.spec.ts | ITIN-02 unknown order does not match a booking |
| chromium | ui/itinerary.spec.ts | ITIN-03 @bva order filter limits input to 10 characters |
| chromium | ui/login.spec.ts | LOGIN-01 @smoke login page controls and title |
| chromium | ui/login.spec.ts | LOGIN-02 @ep both empty |
| chromium | ui/login.spec.ts | LOGIN-02 @ep username empty |
| chromium | ui/login.spec.ts | LOGIN-02 @ep password empty |
| chromium | ui/login.spec.ts | LOGIN-03 @ep unknown user is rejected |
| chromium | ui/login.spec.ts | LOGIN-03 @ep wrong password is rejected |
| chromium | ui/login.spec.ts | LOGIN-03 @ep SQL-like input is rejected |
| chromium | ui/login.spec.ts | LOGIN-03 @ep whitespace is rejected |
| chromium | ui/login.spec.ts | LOGIN-03 @ep long input is rejected |
| chromium | ui/login.spec.ts | LOGIN-04 @smoke valid login and logout |
| chromium | ui/login.spec.ts | LOGIN-05 navigation to ForgotPassword.php |
| chromium | ui/login.spec.ts | LOGIN-05 navigation to Register.php |
| chromium | ui/login.spec.ts | LOGIN-06 unauthenticated access to SearchHotel.php |
| chromium | ui/login.spec.ts | LOGIN-06 unauthenticated access to BookedItinerary.php |
| chromium | ui/login.spec.ts | LOGIN-06 unauthenticated access to ChangePassword.php |
| chromium | ui/registration.spec.ts | REG-01 @ep empty form validates all mandatory fields |
| chromium | ui/registration.spec.ts | REG-02 @bva username length 7 |
| chromium | ui/registration.spec.ts | REG-02 @bva username length 8 |
| chromium | ui/registration.spec.ts | REG-02 @bva username length 9 |
| chromium | ui/registration.spec.ts | REG-02 @bva username length 19 |
| chromium | ui/registration.spec.ts | REG-02 @bva username length 20 |
| chromium | ui/registration.spec.ts | REG-02 @bva username length 21 |
| chromium | ui/registration.spec.ts | REG-02 @bva password length 5 |
| chromium | ui/registration.spec.ts | REG-02 @bva password length 6 |
| chromium | ui/registration.spec.ts | REG-02 @bva password length 7 |
| chromium | ui/registration.spec.ts | REG-02 @bva password length 19 |
| chromium | ui/registration.spec.ts | REG-02 @bva password length 20 |
| chromium | ui/registration.spec.ts | REG-02 @bva password length 21 |
| chromium | ui/registration.spec.ts | REG-03 @ep passwords must match |
| chromium | ui/registration.spec.ts | REG-04 @ep invalid email plainaddress |
| chromium | ui/registration.spec.ts | REG-04 @ep invalid email test@ |
| chromium | ui/registration.spec.ts | REG-04 @ep invalid email @example.com |
| chromium | ui/registration.spec.ts | REG-04 @ep invalid email test@example |
| chromium | ui/registration.spec.ts | REG-05 valid email format is accepted without submitting registration |
| chromium | ui/registration.spec.ts | REG-06 @bva full name length 49 |
| chromium | ui/registration.spec.ts | REG-06 @bva full name length 50 |
| chromium | ui/registration.spec.ts | REG-06 @bva full name length 51 |
| chromium | ui/registration.spec.ts | REG-07 reset clears entered values |
| chromium | ui/registration.spec.ts | REG-08 back to login |
| chromium | ui/search.spec.ts | SEARCH-01 @ep location Sydney |
| chromium | ui/search.spec.ts | SEARCH-01 @ep location Melbourne |
| chromium | ui/search.spec.ts | SEARCH-01 @ep location Brisbane |
| chromium | ui/search.spec.ts | SEARCH-01 @ep location Adelaide |
| chromium | ui/search.spec.ts | SEARCH-01 @ep location London |
| chromium | ui/search.spec.ts | SEARCH-01 @ep location New York |
| chromium | ui/search.spec.ts | SEARCH-01 @ep location Los Angeles |
| chromium | ui/search.spec.ts | SEARCH-01 @ep location Paris |
| chromium | ui/search.spec.ts | SEARCH-02 @ep missing location |
| chromium | ui/search.spec.ts | SEARCH-02 @ep missing rooms |
| chromium | ui/search.spec.ts | SEARCH-02 @ep missing adults |
| chromium | ui/search.spec.ts | SEARCH-02 @ep missing checkIn |
| chromium | ui/search.spec.ts | SEARCH-02 @ep missing checkOut |
| chromium | ui/search.spec.ts | SEARCH-03 @bva rooms=1 |
| chromium | ui/search.spec.ts | SEARCH-03 @bva rooms=2 |
| chromium | ui/search.spec.ts | SEARCH-03 @bva rooms=9 |
| chromium | ui/search.spec.ts | SEARCH-03 @bva rooms=10 |
| chromium | ui/search.spec.ts | SEARCH-03 @bva adults=1 |
| chromium | ui/search.spec.ts | SEARCH-03 @bva adults=2 |
| chromium | ui/search.spec.ts | SEARCH-03 @bva adults=3 |
| chromium | ui/search.spec.ts | SEARCH-03 @bva adults=4 |
| chromium | ui/search.spec.ts | SEARCH-03 @bva children=0 |
| chromium | ui/search.spec.ts | SEARCH-03 @bva children=1 |
| chromium | ui/search.spec.ts | SEARCH-03 @bva children=3 |
| chromium | ui/search.spec.ts | SEARCH-03 @bva children=4 |
| chromium | ui/search.spec.ts | SEARCH-04 @bva dropdowns prevent values outside supported ranges |
| chromium | ui/search.spec.ts | SEARCH-05 @ep optional hotel and room type can be omitted |
| chromium | ui/search.spec.ts | SEARCH-06 @ep room type Standard |
| chromium | ui/search.spec.ts | SEARCH-06 @ep room type Double |
| chromium | ui/search.spec.ts | SEARCH-06 @ep room type Deluxe |
| chromium | ui/search.spec.ts | SEARCH-06 @ep room type Super Deluxe |
| chromium | ui/search.spec.ts | SEARCH-07 @bva checkout one day before check-in is rejected |
| chromium | ui/search.spec.ts | SEARCH-08 @bva one-night stay |
| chromium | ui/search.spec.ts | SEARCH-09 reset restores defaults |
| chromium | ui/selection.spec.ts | SELECT-01 must select a hotel |
| chromium | ui/selection.spec.ts | SELECT-02 @smoke selected hotel details reach booking page |
| chromium | ui/selection.spec.ts | SELECT-03 only one of multiple hotels can be selected |
| chromium | ui/selection.spec.ts | SELECT-04 cancel returns to search |
| api | api/create.spec.ts | Register a user |
| api | api/create.spec.ts | Reject registration without password |
| api | api/create.spec.ts | Reject invalid registration email |
| api | api/create.spec.ts | Reject duplicate user registration |
| api | api/delete.spec.ts | Delete logged-in user account |
| api | api/delete.spec.ts | Require login to delete account |
| api | api/delete.spec.ts | Reject login with wrong password before deletion |
| api | api/delete.spec.ts | Reject unknown account deletion endpoint |
| api | api/list.spec.ts | Return users in API response |
| api | api/list.spec.ts | Reject unknown users endpoint |
| api | api/list.spec.ts | Reject unsupported users-list method |
| api | api/list.spec.ts | Ignore malformed authorization header |
| api | api/login.spec.ts | Log in with valid credentials |
| api | api/login.spec.ts | Reject incorrect password |
| api | api/login.spec.ts | Reject login without password |
| api | api/login.spec.ts | Reject login for unregistered email |
| api | api/patch.spec.ts | Reject PATCH account with a new full name |
| api | api/patch.spec.ts | Reject PATCH account with a new email |
| api | api/patch.spec.ts | Reject PATCH account with a new username |
| api | api/patch.spec.ts | Reject PATCH account with multiple fields |
| api | api/patch.spec.ts | Require login to PATCH an account |
| api | api/patch.spec.ts | Reject PATCH account with an empty body |
| api | api/patch.spec.ts | Reject PATCH account with an invalid email |
| api | api/patch.spec.ts | Reject PATCH account with an email already in use |
| api | api/patch.spec.ts | Reject PATCH to an unknown account endpoint |
| api | api/patch.spec.ts | Reject PATCH account with malformed JSON |
| api | api/update.spec.ts | Update logged-in user account |
| api | api/update.spec.ts | Require login to update account |
| api | api/update.spec.ts | Reject account update without full name |
| api | api/update.spec.ts | Reject unknown account update endpoint |
| requirements | requirements/validation.spec.ts | REQ-DATE @bva @edge reject same-day stay |
| requirements | requirements/validation.spec.ts | REQ-DATE @bva @edge reject past stay |
| requirements | requirements/validation.spec.ts | REQ-DATE @bva @edge reject impossible calendar date |
| requirements | requirements/validation.spec.ts | REQ-DATE @bva @edge reject non-date text |
| requirements | requirements/validation.spec.ts | REQ-CVV @bva @ep reject invalid CVV 12 |
| requirements | requirements/validation.spec.ts | REQ-CVV @bva @ep reject invalid CVV 12345 |
| requirements | requirements/validation.spec.ts | REQ-CVV @bva @ep reject invalid CVV abc |
| requirements | requirements/validation.spec.ts | REQ-CARD @ep reject pasted alphabetic card number |
| requirements | requirements/validation.spec.ts | REQ-SPACE @ep whitespace-only firstName is invalid |
| requirements | requirements/validation.spec.ts | REQ-SPACE @ep whitespace-only lastName is invalid |
| requirements | requirements/validation.spec.ts | REQ-SPACE @ep whitespace-only address is invalid |
