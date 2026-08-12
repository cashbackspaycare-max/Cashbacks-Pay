# CashbacksPay

Milestone 1 mobile-first working prototype for CashbacksPay.

## Included

- Login/Register-style entry
- Home dashboard and transaction history
- Buy orders with 12-digit UTR submission
- Sell orders
- Manual verification admin panel
- Approve/reject status updates
- Device-local prototype persistence

## Run

```bash
npm install
npm run dev
```

Use any 10-digit number for the user view. Use `9999999999` for the admin view. Any password works in this prototype.

## Safety and production note

No real payment is confirmed by this prototype. UTRs require manual admin verification. Production needs a real database, password hashing, OTP provider, authenticated file storage, server-side ledger, audit logs, rate limiting and a licensed payment-provider webhook.
