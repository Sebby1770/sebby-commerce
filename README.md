# NexaCart Commerce Cloud

NexaCart is a Next.js ecommerce MVP with a customer storefront, checkout
API, internal operations tools, Supabase Auth, and role-based permissions.

## Features

- Product catalog with cart and checkout
- API routes for products, orders, checkout, team management, and health checks
- Internal dashboard for revenue, fulfillment, low-stock alerts, inventory, and staff roles
- Supabase SQL migration with tables, RLS policies, grants, profile triggers, and seed products
- Local demo mode so the app runs before Supabase credentials are connected
- Interactive platform stack page covering system design, architecture, frontend,
  APIs, data, auth, hosting, CI/CD, security, rate limiting, CDN readiness,
  logs, monitoring, testing, scaling, and future extensions

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Supabase Setup

1. Create a Supabase project.
2. Apply `supabase/migrations/202606120001_init_commerce.sql`.
3. Copy `.env.example` to `.env.local`.
4. Set:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ENABLE_DEMO_AUTH=false
```

The app works in demo mode when Supabase env vars are absent. Production should
use real Supabase credentials and keep `ENABLE_DEMO_AUTH=false`.

## Base44 Note

Base44 CLI authentication was not active during creation. Once authenticated,
this project can be linked or rebuilt as a Base44 app, but no Base44 resource
commands were run.

## Design

The UI concept used for this implementation is saved at
`docs/design-concept.png`.
