# Role-Based Access Control

NexaCart uses Supabase Auth for accounts and `public.profiles.role` for
business permissions. Authorization is enforced in two places:

1. Next.js API route handlers verify the requester role before writes.
2. Supabase RLS policies protect direct Data API access.

## Roles

| Role | Access |
| --- | --- |
| `customer` | Browse products, create checkout, view own orders |
| `support` | View orders and update customer-facing order status |
| `inventory_manager` | Manage products and inventory events |
| `operations_manager` | Manage products, orders, and fulfillment |
| `admin` | Manage staff roles and all business resources |

## Production Notes

- Do not expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.
- Keep role assignment in `profiles.role`; do not authorize from user-editable metadata.
- Apply `supabase/migrations/202606120001_init_commerce.sql` before connecting the app.
- Use Supabase Dashboard or the admin API route to promote the first admin.
