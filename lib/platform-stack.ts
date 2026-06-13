export type PlatformLayer = {
  id: string;
  label: string;
  summary: string;
  owner: string;
  status: "Live" | "Ready" | "Hardened" | "Queued";
  metric: string;
  color: string;
  controls: string[];
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
    color: "gold",
    controls: [
      "Storefront and internal-workspace journeys",
      "Reusable page structure and navigation groups",
      "Responsive states for desktop and mobile"
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
    color: "amber",
    controls: [
      "Storefront, operations, API, and auth modules",
      "Typed shared business entities",
      "Supabase-ready server and browser clients"
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
    color: "bronze",
    controls: [
      "Customer storefront and cart",
      "Internal dashboards and management pages",
      "Interactive platform stack detail panel"
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
    color: "blue",
    controls: [
      "Zod request validation",
      "Role-aware route handlers",
      "Consistent JSON error responses"
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
    color: "teal",
    controls: [
      "Products, orders, order items, and profiles",
      "Demo data for local work without credentials",
      "Supabase migration and setup documentation"
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
    color: "green",
    controls: [
      "Customer, support, inventory, operations, and admin roles",
      "Protected staff APIs",
      "Production demo-auth disable switch"
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
    color: "charcoal",
    controls: [
      "Runtime health endpoint",
      "Server-side environment validation",
      "Production-ready app build"
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
    color: "silver",
    controls: [
      "Committed feature history",
      "Typecheck, build, and audit scripts",
      "Push-ready repository workflow"
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
    color: "orange",
    controls: [
      "Server-only Supabase admin client",
      "Role requirements on staff writes",
      "Security notes and production setup docs"
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
    color: "coral",
    controls: [
      "Per-route request windows",
      "Retry and rate-limit response headers",
      "Separate limits for checkout, reads, and admin writes"
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
    color: "red",
    controls: [
      "Image-backed product cards",
      "Next.js static asset pipeline",
      "Deployment path for CDN caching rules"
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
    color: "maroon",
    controls: [
      "Standard API error format",
      "Health endpoint for runtime checks",
      "Browser console QA loop"
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
    color: "purple",
    controls: [
      "Low-stock alerts",
      "Order exception review",
      "Health and configuration status"
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
    color: "indigo",
    controls: [
      "Typecheck script",
      "Production build",
      "Rendered UI and interaction verification"
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
    color: "brick",
    controls: [
      "Managed database option",
      "Serverless route handlers",
      "Environment-based production mode"
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
    color: "sky",
    controls: [
      "Payments and webhook adapters",
      "Analytics and reporting exports",
      "Marketplace and integration expansion"
    ]
  }
];

export const platformStats = [
  { label: "Stack layers", value: "16", detail: "From the reference image" },
  { label: "Live layers", value: "8", detail: "Working in the app today" },
  { label: "Control points", value: "48", detail: "Mapped across owners" },
  { label: "Production posture", value: "Ready", detail: "Cloud deployment path" }
];
