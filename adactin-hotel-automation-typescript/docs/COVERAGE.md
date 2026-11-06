# Coverage and test design

EP = Equivalence Partitioning: test one or more representatives from meaningful valid/invalid input groups.
BVA = Boundary Value Analysis: test at, just below and just above a stated limit. For dropdowns, unavailable out-of-range values are verified as unavailable; the UI cannot select them.

The suite covers the core Adactin journey. It does not claim 100% exhaustive coverage. Rules below come from inspected form controls/client validation or are explicitly identified as proposed requirements.

| Feature | Automated examples | Technique / location |
| --- | --- | --- |
| Login | Controls/title, missing fields, invalid username/password, whitespace, long input, SQL-like text, valid login/logout, links | EP; `login.spec.ts` |
| Session access | Search, itinerary and password pages without login | Access control; `login.spec.ts` |
| Registration | All required fields; mismatched confirmation; valid/invalid email format; reset/back navigation | EP; `registration.spec.ts` |
| Username | Minimum 8: 7/8/9; maximum 20: 19/20/21 | BVA; registration is deliberately not completed |
| Registration password | Minimum 6: 5/6/7; maximum 20: 19/20/21 | BVA; password values are synthetic |
| Full name | Maximum 50: 49/50/51 | BVA; input truncation |
| Recovery | Empty/invalid email; reset | EP; no real email requested |
| Change password | Required fields and confirmation mismatch | Negative only; real current password is never submitted |
| Locations | All 8 location choices | Valid EP |
| Rooms | 1/2/9/10 accepted; 0 and 11 unavailable | BVA |
| Adults | 1/2/3/4 accepted; 0 and 5 unavailable | BVA |
| Children | 0/1/3/4 accepted; -1 and 5 unavailable | BVA |
| Search | Missing required fields; optional hotel/room type omitted; all 4 room types; reset | EP |
| Dates | Checkout one day before check-in rejected; one-night stay accepted | BVA |
| Hotel selection | Required radio, one selection among four, detail transfer, cancel | State transitions |
| Booking | All 8 required inputs; missing expiry month/year; card lengths 1/14/15 invalid and 17 truncated to 16 | EP / BVA |
| Confirmation | Valid booking and generated order, hotel/location/room type, search and itinerary buttons | Positive end-to-end |
| Itinerary | Exact order search, unknown order, cancel dismissal, cancellation, input max 10 | Functional / BVA; only own new booking deleted |
| Separate API | Registration, login, list, PUT update, DELETE, unsupported PATCH, invalid/unknown/missing/duplicate inputs | Original scenarios migrated to TypeScript, duplicate list tests removed |

## Requirement probes (separate suite)

`npm run test:requirements` checks expected stricter behavior. These tests are not skipped or marked expected-to-fail: a defect remains red. The demo's observed client validation does not implement several of these checks. Confirm these rules with the application owner before treating them as release criteria.

- Reject equal check-in/check-out dates (if minimum stay is one night).
- Reject past stays, impossible dates and non-date text.
- Reject invalid CVV lengths/text and pasted alphabetic card numbers.
- Reject whitespace-only first/last name and address.

Invalid booking probes intentionally omit another mandatory field so a validation defect cannot accidentally create a booking.

## Manual / separate-account checks

- Successful registration including CAPTCHA and Terms acceptance, duplicate real account, activation email.
- CAPTCHA correctness/expiry/refresh, accessibility of the challenge.
- Password-recovery delivery, invalid/expired/reused recovery link and mailbox contents.
- Successful password change, password policy, old password rejection and restoring credentials: use a dedicated disposable account.
- Bulk cancel/select-all across multiple bookings: use an isolated account; never select all on a shared login.
- Concurrency, session expiry, browser-back after logout, multiple devices, load/performance.
- Full accessibility, responsive/mobile layout, visual regression, security assessment, backend/server-side input validation.
- Pricing/tax rules and maximum-stay rules require authoritative business requirements before adding assertions.

API tests target a different practice application, not Adactin's hotel backend. They are not evidence of Adactin API coverage.
