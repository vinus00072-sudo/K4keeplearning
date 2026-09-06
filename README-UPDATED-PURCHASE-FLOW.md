# KeepLearning – Purchase Flow Safety Update

This version keeps the existing Sign Up, Sign In, payment, enrollment, video access and PDF download flows intact while improving the course purchase flow for logged-out users.

## Purchase flow
1. User clicks `कोर्स खरेदी करून अनलॉक करा` while logged out.
2. A dedicated professional purchase-signup popup asks for full name, mobile number, email and password.
3. Client-side validation checks required fields, name length, Indian 10-digit mobile format, email format and password length.
4. A successful Supabase signup with an active session continues directly to the secure Razorpay checkout.
5. If the email is already registered, the popup switches to a dedicated Login → Payment flow instead of creating a duplicate account.
6. If Supabase email confirmation is enabled, payment is not started without an authenticated session; the user is shown a confirmation step and can log in afterwards.
7. Payment verification remains server-side. Enrollment is created only after Razorpay signature, order, amount and captured-payment checks succeed.
8. Meta Pixel `Purchase` is fired only after the server confirms the payment.
9. Existing authenticated users continue directly to Razorpay checkout.
10. Existing Sign Up, Sign In, Logout, course enrollment, video access and secure PDF download behavior is preserved.

## Edge cases covered
- Empty fields
- Invalid/short name
- Invalid mobile number
- Invalid email
- Short password
- Existing email/account
- Email confirmation enabled
- Missing/expired login session
- Razorpay script unavailable
- Payment failure/dismissal
- Server-side payment verification failure
- Repeated payment callback / existing payment record
- Existing enrollment / locked-vs-unlocked course access
