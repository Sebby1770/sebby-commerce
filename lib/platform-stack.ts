export type PlatformLayer = {
  id: string;
  label: string;
  summary: string;
  owner: string;
  status: "Live" | "Ready" | "Hardened" | "Queued";
  metric: string;
  actionLabel: string;
  actionHref: string;
  controls: string[];
  evidence: string[];
};

export const platformLayers: PlatformLayer[] = [
  {
    id: "system-design",
    label: "system design",
    summary:
      "NexaCart now has a clearer product model for commerce, operations, staff permissions, and the customer checkout path.",
    owner: "Product systems",
    status: "Live",
    metric: "7 journeys mapped",
    actionLabel: "Open store settings",
    actionHref: "/settings",
    controls: [
      "Storefront and internal-workspace journeys",
      "Reusable page structure and navigation groups",
      "Responsive states for desktop and mobile"
    ],
    evidence: [
      "Real storefront, admin dashboard, and business pages share one app shell",
      "Sidebar groups commerce, operations, and settings into stable destinations",
      "Settings page keeps brand, checkout, and production posture in one place"
    ]
  },
  {
    id: "system-architecture",
    label: "system architecture",
    summary:
      "The app uses a Next.js App Router structure with separated API, auth, data, page-content, and UI component boundaries.",
    owner: "Engineering",
    status: "Live",
    metric: "4 domains split",
    actionLabel: "Check system health",
    actionHref: "/api/health",
    controls: [
      "Storefront, operations, API, and auth modules",
      "Typed shared business entities",
      "Supabase-ready server and browser clients"
    ],
    evidence: [
      "Next.js App Router separates pages, components, API routes, and lib modules",
      "Shared TypeScript entities define products, orders, roles, and team members",
      "Health endpoint reports runtime service, Supabase config, and demo auth"
    ]
  },
  {
    id: "frontend",
    label: "frontend",
    summary:
      "The frontend is a proper commerce workspace with real routes, a less crowded sidebar, role-aware controls, and stack visualization.",
    owner: "Frontend",
    status: "Live",
    metric: "19 routes",
    actionLabel: "Open storefront",
    actionHref: "/",
    controls: [
      "Customer storefront and cart",
      "Internal dashboards and management pages",
      "Interactive implementation detail panel"
    ],
    evidence: [
      "Catalog, orders, customers, discounts, inventory, reports, roles, and settings are real routes",
      "Storefront cart and checkout state update in the browser",
      "Desktop and mobile layouts were verified after implementation"
    ]
  },
  {
    id: "apis-backend-logic",
    label: "APIs & backend logic",
    summary:
      "Route handlers cover products, checkout, orders, staff management, and runtime health with validation at the edge of each write.",
    owner: "Backend",
    status: "Live",
    metric: "6 API surfaces",
    actionLabel: "Open products API",
    actionHref: "/api/products",
    controls: [
      "Zod request validation",
      "Role-aware route handlers",
      "Consistent JSON error responses"
    ],
    evidence: [
      "Products, checkout, orders, team, and health APIs are implemented",
      "Write endpoints validate payloads before mutating data",
      "Protected endpoints resolve auth context before allowing staff operations"
    ]
  },
  {
    id: "databases-storage",
    label: "databases & storage",
    summary:
      "Supabase tables, seed data, demo fallback storage, and migration docs give the app a database path for production and local testing.",
    owner: "Data",
    status: "Ready",
    metric: "RLS migration",
    actionLabel: "Open inventory",
    actionHref: "/inventory",
    controls: [
      "Products, orders, order items, and profiles",
      "Demo data for local work without credentials",
      "Supabase migration and setup documentation"
    ],
    evidence: [
      "Seed data keeps the site usable before Supabase credentials are connected",
      "Supabase migration covers products, orders, order items, profiles, and role policies",
      "Inventory pages expose stock and low-stock workflows"
    ]
  },
  {
    id: "auth-permissions",
    label: "auth & permissions",
    summary:
      "Supabase Auth, profile roles, API permission checks, and a demo role switcher make access rules visible and testable.",
    owner: "Security",
    status: "Live",
    metric: "5 roles",
    actionLabel: "Open roles",
    actionHref: "/roles",
    controls: [
      "Customer, support, inventory, operations, and admin roles",
      "Protected staff APIs",
      "Production demo-auth disable switch"
    ],
    evidence: [
      "Role switcher shows customer, support, inventory, operations, and admin access",
      "API routes enforce allowed roles for staff actions",
      "Supabase Auth sign-in panel is wired for production credentials"
    ]
  },
  {
    id: "hosting-cloud",
    label: "hosting & cloud",
    summary:
      "The app is cloud-deployable as a Next.js service with health checks and environment-driven Supabase configuration.",
    owner: "Platform",
    status: "Ready",
    metric: "Vercel-ready",
    actionLabel: "Open health endpoint",
    actionHref: "/api/health",
    controls: [
      "Runtime health endpoint",
      "Server-side environment validation",
      "Production-ready app build"
    ],
    evidence: [
      "Production build completed successfully",
      "Runtime health endpoint reports service readiness",
      "Environment variables control Supabase and demo-auth behavior"
    ]
  },
  {
    id: "cicd-version-control",
    label: "CI/CD & version control",
    summary:
      "GitHub is the source of truth for code history, checks, pushes, and future deployment automation.",
    owner: "Release",
    status: "Live",
    metric: "GitHub remote",
    actionLabel: "Open GitHub repo",
    actionHref: "https://github.com/Sebby1770/sebby-commerce",
    controls: [
      "Committed feature history",
      "Typecheck, build, and audit scripts",
      "Push-ready repository workflow"
    ],
    evidence: [
      "Repository is published to GitHub under Sebby1770/sebby-commerce",
      "Package scripts run typecheck, production build, and security audit",
      "Main branch carries the implementation history"
    ]
  },
  {
    id: "security",
    label: "security",
    summary:
      "Sensitive operations stay server-side, service-role credentials are never exposed to the browser, and protected routes enforce roles.",
    owner: "Security",
    status: "Hardened",
    metric: "RBAC enforced",
    actionLabel: "Open security roles",
    actionHref: "/roles",
    controls: [
      "Server-only Supabase admin client",
      "Role requirements on staff writes",
      "Security notes and production setup docs"
    ],
    evidence: [
      "Service-role Supabase client is server-only",
      "Staff write APIs reject unauthorized roles",
      "Security documentation calls out production credential rules"
    ]
  },
  {
    id: "rate-limiting",
    label: "rate limiting",
    summary:
      "API route handlers now have a process-local guard that limits repeated requests by endpoint and caller address.",
    owner: "Backend",
    status: "Live",
    metric: "429 guard",
    actionLabel: "Open checkout API",
    actionHref: "/api/checkout",
    controls: [
      "Per-route request windows",
      "Retry and rate-limit response headers",
      "Separate limits for checkout, reads, and admin writes"
    ],
    evidence: [
      "Products, orders, checkout, and team APIs call the shared rate-limit helper",
      "429 responses include retry and limit headers",
      "Checkout burst smoke test returned 429 after repeated requests"
    ]
  },
  {
    id: "caching-cdn",
    label: "caching & CDN",
    summary:
      "The app is structured for CDN delivery, static assets, and deploy-time caching while keeping dynamic commerce APIs server-controlled.",
    owner: "Platform",
    status: "Ready",
    metric: "Static assets",
    actionLabel: "Open catalog",
    actionHref: "/catalog",
    controls: [
      "Image-backed product cards",
      "Next.js static asset pipeline",
      "Deployment path for CDN caching rules"
    ],
    evidence: [
      "Product cards use stable external image URLs and responsive grid sizing",
      "Next.js builds static page routes for CDN-friendly delivery",
      "Dynamic commerce APIs remain server-controlled"
    ]
  },
  {
    id: "error-tracking-logs",
    label: "error tracking & logs",
    summary:
      "Consistent API errors, build output, console checks, and health responses create the logging foundation for hosted observability.",
    owner: "Reliability",
    status: "Ready",
    metric: "JSON errors",
    actionLabel: "Open health endpoint",
    actionHref: "/api/health",
    controls: [
      "Standard API error format",
      "Health endpoint for runtime checks",
      "Browser console QA loop"
    ],
    evidence: [
      "API helpers return consistent JSON error payloads",
      "Health endpoint supports runtime status checks",
      "Browser validation confirmed no console warnings or errors on the platform page"
    ]
  },
  {
    id: "monitoring-alerts",
    label: "monitoring & alerts",
    summary:
      "The dashboard tracks the operating signals that become production monitors: low stock, open orders, role changes, and service health.",
    owner: "Operations",
    status: "Ready",
    metric: "4 alert types",
    actionLabel: "Open reports",
    actionHref: "/reports",
    controls: [
      "Low-stock alerts",
      "Order exception review",
      "Health and configuration status"
    ],
    evidence: [
      "Dashboard surfaces low-stock and open-order operational signals",
      "Reports page centralizes business monitoring",
      "Activity and health surfaces support alert wiring later"
    ]
  },
  {
    id: "testing",
    label: "testing",
    summary:
      "TypeScript, production build, npm audit, and browser interaction checks cover the current delivery path.",
    owner: "Quality",
    status: "Live",
    metric: "4 checks",
    actionLabel: "Open activity log",
    actionHref: "/activity",
    controls: [
      "Typecheck script",
      "Production build",
      "Rendered UI and interaction verification"
    ],
    evidence: [
      "TypeScript check passes",
      "Production build passes",
      "Security audit and rendered browser interaction checks pass"
    ]
  },
  {
    id: "scaling",
    label: "scaling",
    summary:
      "The app is split around stateless routes, managed Supabase storage, and cloud deployment so it can grow beyond the demo dataset.",
    owner: "Platform",
    status: "Ready",
    metric: "Stateless API",
    actionLabel: "Open dashboard",
    actionHref: "/admin",
    controls: [
      "Managed database option",
      "Serverless route handlers",
      "Environment-based production mode"
    ],
    evidence: [
      "API handlers stay stateless and can run behind a cloud runtime",
      "Supabase can carry production data storage",
      "Demo mode can be disabled without rewriting the app"
    ]
  },
  {
    id: "and-more",
    label: "and more...",
    summary:
      "Future extension slots include payments, webhooks, analytics exports, advanced search, internationalization, and automated incident response.",
    owner: "Product roadmap",
    status: "Queued",
    metric: "6 extensions",
    actionLabel: "Open apps",
    actionHref: "/apps",
    controls: [
      "Payments and webhook adapters",
      "Analytics and reporting exports",
      "Marketplace and integration expansion"
    ],
    evidence: [
      "Apps page gives integrations a destination",
      "API and auth boundaries are ready for payments, webhooks, and analytics",
      "Roadmap items are visible without pretending they are already complete"
    ]
  }
];

export const platformStats = [
  { label: "Capabilities", value: "16", detail: "Implemented from the checklist" },
  { label: "Live capabilities", value: "8", detail: "Working in the app today" },
  { label: "Control points", value: "48", detail: "Mapped across owners" },
  { label: "Production posture", value: "Ready", detail: "Cloud deployment path" }
];
