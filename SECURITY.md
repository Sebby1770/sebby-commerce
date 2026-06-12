# Security Notes

- The app uses Supabase Auth bearer tokens in production API calls.
- Local demo mode accepts `x-demo-role` only when Supabase env vars are missing
  or `ENABLE_DEMO_AUTH=true`. Keep that disabled in production.
- The service role key is only read from server-side route handlers.
- RLS is enabled on every exposed table in the migration.
- Data API grants are explicit and paired with RLS policies.
- Role checks use `profiles.role`, not user-editable metadata.
- Security-definer helper functions live in the private `app_private` schema.
- Product stock decrementing is callable by the server-side API through the
  service role, not by browser clients.
