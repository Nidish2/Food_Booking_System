# Comprehensive Test Suite Execution Report

This document reports the details of all 91 test cases executed across the Frontend (FE), Backend (BE), and Database (DB) integration layers. All tests have successfully passed.

---

## Summary of Test Runs

- **Backend (BE) & Database (DB) Integration Tests**: 50 tests executed. **50 Passed / 0 Failed.**
- **Frontend (FE) & Component/Utility Tests**: 41 tests executed. **41 Passed / 0 Failed.**
- **Total Suite Coverage**: 91 tests. **91 Passed / 0 Failed.**

---

## 1. Backend & Database Integration Test Report (50 Cases)

These tests execute database-dependent queries, service-level transaction workflows (overlapping dates prevention), authentication, and review submissions.

| # | Component | Test Feature Description | Expected Result | Actual Result | Verdict |
|---|---|---|---|---|---|
| 1 | Auth | Registers a user and returns a sanitized user object and JWT | JWT token generated, `passwordHash` omitted | Sanitized user object returned, JWT token matches | **PASS** |
| 2 | Auth | Rejects duplicate signups with the same email | Throws 409 Conflict error | Throws 409 Conflict | **PASS** |
| 3 | Auth | Returns standard invalid credentials error for non-existent email | Throws 401 Unauthorized | Throws 401 Unauthorized | **PASS** |
| 4 | Auth | Requesting forgot password link does not alter password hash | User password stays unchanged | User password remains unchanged | **PASS** |
| 5 | Auth | Registers a new user with a strong password (mock DB) | Success, saves user to DB | User successfully created | **PASS** |
| 6 | Auth | Log in successfully with correct credentials | Returns JWT, 200 OK | Returns JWT, 200 OK | **PASS** |
| 7 | Auth | Reject login with incorrect password | Throws 401 Unauthorized | Throws 401 Unauthorized | **PASS** |
| 8 | Auth | Enforces password length of at least 8 characters | Validates `length >= 8` | Returns true | **PASS** |
| 9 | Validator | Accepts a fully valid registration body | Zod schema parses successfully | Returns success: true | **PASS** |
| 10 | Validator | Rejects names shorter than 2 characters | Zod validation fails | Returns success: false | **PASS** |
| 11 | Validator | Rejects malformed email formats | Zod validation fails | Returns success: false | **PASS** |
| 12 | Validator | Rejects weak passwords without uppercase characters | Zod validation fails | Returns success: false | **PASS** |
| 13 | Validator | Rejects weak passwords without numbers or special symbols | Zod validation fails | Returns success: false | **PASS** |
| 14 | Validator | Rejects passwords matching the common blacklist dictionary | Zod validation fails | Returns success: false | **PASS** |
| 15 | Validator | Accepts correct login credentials structure | Zod schema parses successfully | Returns success: true | **PASS** |
| 16 | Validator | Rejects missing password on login payload | Zod validation fails | Returns success: false | **PASS** |
| 17 | Validator | Validates forgot password email shapes | Zod schema parses successfully | Returns success: true | **PASS** |
| 18 | Validator | Accepts valid password reset token and strong password | Zod schema parses successfully | Returns success: true | **PASS** |
| 19 | Validator | Rejects password reset token shorter than 32 characters | Zod validation fails | Returns success: false | **PASS** |
| 20 | Validator | Validates valid room configurations | Zod schema parses successfully | Returns success: true | **PASS** |
| 21 | Validator | Rejects room setups with negative or zero capacity | Zod validation fails | Returns success: false | **PASS** |
| 22 | Validator | Rejects room setups with negative pricing | Zod validation fails | Returns success: false | **PASS** |
| 23 | Validator | Accepts valid rating scale integers of 1 to 5 | Zod schema parses successfully | Returns success: true | **PASS** |
| 24 | Validator | Rejects rating value equal to 0 | Zod validation fails | Returns success: false | **PASS** |
| 25 | Validator | Rejects rating value equal to 6 | Zod validation fails | Returns success: false | **PASS** |
| 26 | Room | Creates a room when the room number is unique | Room successfully created in DB | Room object created and returned | **PASS** |
| 27 | Room | Rejects duplicate room numbers with 409 conflict | Throws 409 Conflict error | Throws 409 Conflict | **PASS** |
| 28 | Room | Filters room availability using dynamic dates | Room matches filter | Filtered rooms list returned | **PASS** |
| 29 | Booking | Creates a booking when no dates overlap | Booking created in DB, returns total pricing | Booking created, total pricing calculated | **PASS** |
| 30 | Booking | Rejects overlapping booking dates for the same room (DB) | Blocks overlap, throws 409 Conflict | Blocks overlap, throws 409 Conflict | **PASS** |
| 31 | Booking | Filters booking history by confirmed active status | Returns only matching bookings | Filtered bookings returned | **PASS** |
| 32 | Booking | Allows feedback only for the booking owner after checkout | Review successfully added to DB | Review successfully added | **PASS** |
| 33 | Booking | Rejects feedback from a different user than the guest | Throws 403 Forbidden | Throws 403 Forbidden | **PASS** |
| 34 | Booking | Enforces overlapping check (checkin < existingCheckout) | Returns true for overlap | Returns true | **PASS** |
| 35 | Booking | Allows booking on adjacent dates (checkout = next checkin) | Returns false for overlap | Returns false | **PASS** |
| 36 | Booking | Treats checkouts in the past as completed bookings | Returns true (checkout <= today) | Returns true | **PASS** |
| 37 | Booking | Allows feedback only after checkout date has passed | Returns true (checkout <= today) | Returns true | **PASS** |
| 38 | Reviews | Disallows duplicate review submissions | Throws 400 Bad Request | Throws 400 Bad Request | **PASS** |
| 39 | Reviews | Blocks rating out of bounds on review endpoint | Throws 400 Bad Request | Throws 400 Bad Request | **PASS** |
| 40 | Edge Cases | Service returns 0 nights if checkin matches checkout date | Returns 0 nights | Returns 0 nights | **PASS** |
| 41 | Edge Cases | Service returns 0 nights if checkout date is before checkin date | Returns 0 nights | Returns 0 nights | **PASS** |
| 42 | Edge Cases | ApiError utility formats standard responses correctly | Generates status 400 + detail arrays | Formats matches spec | **PASS** |
| 43 | API Endpoints | Registers a guest user and returns status 201 OK | Status 201, token present | Status 201, token present | **PASS** |
| 44 | API Endpoints | Performs a successful login workflow | Status 200, JWT token returned | Status 200, JWT token returned | **PASS** |
| 45 | API Endpoints | Rejects login due to incorrect password | Status 401 Unauthorized | Status 401 Unauthorized | **PASS** |
| 46 | API Endpoints | Supports logout as a clean end-to-end flow | Clears cookie, Status 200 | Clears cookie, Status 200 | **PASS** |
| 47 | API Endpoints | Allows admin to create and edit rooms | Admin user creates room successfully | Room successfully created | **PASS** |
| 48 | API Endpoints | Blocks normal users from creating or editing rooms | Normal user gets 403 Forbidden | Normal user gets 403 Forbidden | **PASS** |
| 49 | API Endpoints | Books a room, blocks overlap, and returns user history | Status 201, blocks duplicate, returns history | Successfully processed | **PASS** |
| 50 | API Endpoints | Allows admins to view all system users and all bookings | Returns full list, 200 OK | Returns full list, 200 OK | **PASS** |

---

## 2. Frontend Test Report (41 Cases)

These tests run inside Vitest + JSDOM simulating button state rendering, autocomplete suggestion dropdown interactions, custom component text parameters, and client-side form validator schemas.

| # | Component | Test Feature Description | Expected Result | Actual Result | Verdict |
|---|---|---|---|---|---|
| 51 | Badge | Renders correctly with default tone | Elements render, text present, has slate color styles | Renders, text present, has slate classes | **PASS** |
| 52 | Badge | Renders correctly with success tone | Elements render, text present, has emerald color styles | Renders, text present, has emerald classes | **PASS** |
| 53 | Button | Renders children text correctly | Shows child content inside button | Shows child content inside button | **PASS** |
| 54 | Button | Applies primary style colors by default | Has standard navy background class | Has bg-brand-navy class | **PASS** |
| 55 | Button | Applies secondary style colors when variant is specified | Has translucent border/bg style classes | Has border-slate-200/80 classes | **PASS** |
| 56 | Button | Shows spinner loading indicator when isLoading is true | Renders animated SVG spinner | Renders spinner SVG | **PASS** |
| 57 | Button | Disables input interactions when disabled is true | Button element is disabled | Button element is disabled | **PASS** |
| 58 | Input | Renders label and placeholder props correctly | Label and placeholder text visible | Label and placeholder text visible | **PASS** |
| 59 | Input | Displays validation error messages correctly | Error text renders, has brand-red colors | Error text renders, text is red | **PASS** |
| 60 | Input | Toggles password text/hidden type on eye icon click | Toggles input type between text and password | Input type changes correctly | **PASS** |
| 61 | StarRating | Renders rating label text based on rating prop | Renders screen reader rating label | Screen reader label matches | **PASS** |
| 62 | StarRating | Highlights the correct number of stars | Star elements match rating count | Star elements highlighted matches | **PASS** |
| 63 | Date Utility | Formats a standard ISO date string to medium style | Outputs formatted date with month string | Outputs matches medium format | **PASS** |
| 64 | Date Utility | Nights counter returns 0 if checkin date is missing | Returns 0 nights | Returns 0 nights | **PASS** |
| 65 | Date Utility | Nights counter returns 0 if checkout date is missing | Returns 0 nights | Returns 0 nights | **PASS** |
| 66 | Date Utility | Calculates nights between checkin and checkout dates | Returns nights count (e.g. 7 nights) | Returns nights count matches | **PASS** |
| 67 | Currency Utility| Formats numeric string to INR format with no decimals | Formats to currency shape (e.g. ₹3,200) | Formats to currency matches | **PASS** |
| 68 | Currency Utility| Formats integer to INR format | Formats to currency shape (e.g. ₹5,800) | Formats to currency matches | **PASS** |
| 69 | EmptyState | Renders custom title and message properties | Title and message visible in panel | Title and message visible | **PASS** |
| 70 | LoadingState | Renders default Loading... message | Text is visible | "Loading..." is visible | **PASS** |
| 71 | LoadingState | Renders custom loading message when supplied | Custom text is visible | Custom text is visible | **PASS** |
| 72 | Skeleton | Renders a pulsing placeholder block | Has animate-pulse utility class | Has animate-pulse class | **PASS** |
| 73 | Skeleton | Renders RoomCardSkeleton with sub-skeletons | Pulse elements >= 5 | Pulse elements count matches | **PASS** |
| 74 | Skeleton | Renders RoomGridSkeleton with 3 sub-cards | Pulse elements >= 15 | Pulse elements count matches | **PASS** |
| 75 | Skeleton | Renders BookingHistorySkeleton with 3 sub-cards | Rounded-2xl elements = 3 | Card count matches | **PASS** |
| 76 | Autocomplete | Renders dropdown input with labels and helper text | Label and default helper text present | Label and helper text present | **PASS** |
| 77 | Autocomplete | Opens suggestion list listbox when focused | Renders options list box and list elements | Options list box renders | **PASS** |
| 78 | Autocomplete | Selecting/clicking option updates input value | Callback triggers with selected value | Callback triggers with selected value | **PASS** |
| 79 | Autocomplete | Filters suggestion list based on user input typing | Returns filtered list matching input query | Returns matching list only | **PASS** |
| 80 | Auth Schema | signupSchema accepts fully valid data | safeParse returns success: true | safeParse returns success: true | **PASS** |
| 81 | Auth Schema | signupSchema rejects invalid email formats | safeParse returns success: false | safeParse returns success: false | **PASS** |
| 82 | Auth Schema | signupSchema rejects passwords shorter than 8 chars | safeParse returns success: false | safeParse returns success: false | **PASS** |
| 83 | Auth Schema | signupSchema rejects commonly used dictionary passwords | safeParse returns success: false | safeParse returns success: false | **PASS** |
| 84 | Auth Schema | loginSchema accepts valid login credential formats | safeParse returns success: true | safeParse returns success: true | **PASS** |
| 85 | Auth Schema | forgotPasswordSchema requires a valid email | safeParse returns success: true | safeParse returns success: true | **PASS** |
| 86 | Auth Schema | resetPasswordSchema requires token length >= 32 | safeParse returns success: false for short tokens| safeParse returns success: false | **PASS** |
| 87 | Booking Schema | bookingSchema accepts valid future dates | safeParse returns success: true | safeParse returns success: true | **PASS** |
| 88 | Booking Schema | bookingSchema rejects guest names shorter than 2 chars| safeParse returns success: false | safeParse returns success: false | **PASS** |
| 89 | Booking Schema | bookingSchema rejects invalid guest email shapes | safeParse returns success: false | safeParse returns success: false | **PASS** |
| 90 | Booking Schema | bookingSchema rejects checkin dates in the past | safeParse returns success: false | safeParse returns success: false | **PASS** |
| 91 | Booking Schema | bookingSchema rejects checkout dates before checkin | safeParse returns success: false | safeParse returns success: false | **PASS** |
