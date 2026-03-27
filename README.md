## Trulo – Mid-Term Commercial Rentals | Boston

This app now targets `Vercel + Supabase Postgres`.

### Local development

```bash
npm install
npm run dev
```

### Required environment variables

Frontend:

- `VITE_TURNSTILE_SITE_KEY`

Backend:

- `SUPABASE_DB_URL`
- `TURNSTILE_SECRET_KEY`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `ADMIN_NOTIFICATION_EMAIL`
- `PUBLIC_APP_URL`
- `SALES_LOGIN_EMAIL`
- `SALES_LOGIN_PASSWORD`
- `SALES_SESSION_SECRET`

Notes:

- `SUPABASE_DB_URL` should be your direct Postgres connection string from Supabase.
- The API bootstraps its own tables on first request, so you do not need a separate migration step just to get started.
- The frontend remains a Vite SPA and is routed through `vercel.json`.

### Deploying to Vercel

1. Import the repo into Vercel.
2. Copy `.env.example` and fill in your real values.
3. Add the same values in the Vercel project settings.
4. Deploy.

Vercel will build the SPA into `dist/` and serve the backend from the `api/` directory.

### Recommended Setup Order

1. Create a Supabase project and copy its Postgres connection string into `SUPABASE_DB_URL`.
2. Create a Resend API key and verify the sending domain or sender used in `RESEND_FROM_EMAIL`.
3. Create or reuse a Cloudflare Turnstile site and secret key.
4. Set `PUBLIC_APP_URL` to your final Vercel domain or custom domain.
5. Set a strong `SALES_SESSION_SECRET` and change the default sales login credentials.
6. Deploy to Vercel and submit one test lead to auto-create the tables.
