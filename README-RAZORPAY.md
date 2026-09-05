# KeepLearning — Razorpay setup

This version adds Razorpay Standard Checkout with server-side order creation and payment-signature verification.

## Vercel Environment Variables

Add these in the Vercel project settings (Production, and Preview if you want to test there):

- `RAZORPAY_KEY_ID` = your Razorpay Live Key ID
- `RAZORPAY_KEY_SECRET` = your Razorpay Key Secret (**never put this in GitHub/frontend**)
- `SUPABASE_URL` = `https://vowlzxhgjyzwzlhdgrnz.supabase.co`
- `SUPABASE_SERVICE_ROLE_KEY` = your Supabase service-role secret (**server-only**)

## Important

1. Do not add `RAZORPAY_KEY_SECRET` or `SUPABASE_SERVICE_ROLE_KEY` to HTML/JS.
2. The browser only receives the Razorpay Key ID from `/api/create-order`.
3. The server reads the course selling price from Supabase and creates the Razorpay order.
4. The server verifies the Razorpay signature and payment status before creating enrollment.
5. The course unlocks when the verified payment is captured.
6. Make sure Razorpay payment capture is configured appropriately in the Dashboard.

## Existing Supabase tables expected

- `public.courses`
- `public.payments`
- `public.enrollments`

The existing `payments` table should contain `user_id`, `course_id`, `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature`, `amount`, `currency`, and `status`.

The existing `enrollments` table should have the unique `(user_id, course_id)` constraint used by the site.


## Authentication update
- Shared Supabase auth UI now shows the logged-in user's name/email and a Logout button.
- Login state is driven by Supabase session/auth events, including refresh/token changes.
- Course access is rechecked after login/logout.
- The course page no longer shows a duplicate lower Buy/Unlock button.
- No mobile number was added to the KeepLearning UI.


## Responsive header polish
- Mobile header no longer lets the logo, menu icon, account name, and Logout button overlap.
- Logged-in account uses a custom KeepLearning-style SVG icon.
- User name remains visible on mobile with a compact email line.
- Mobile hero typography and illustration spacing were reduced to avoid excessive vertical scrolling.
