export type BusinessPageConfig = {
  key: string;
  overline: string;
  title: string;
  description: string;
  notice: string;
  actionLabel: string;
  primaryPanelTitle: string;
  workflowTitle: string;
  metrics: Array<{
    label: string;
    value: string;
    detail: string;
  }>;
  rows: Array<{
    primary: string;
    secondary: string;
    meta: string;
    status: string;
    tone?: "warning" | "paid" | "packing" | "fulfilled" | "pending";
  }>;
  workflow: Array<{
    title: string;
    description: string;
  }>;
};

export const pages = {
  catalog: {
    key: "catalog",
    overline: "Catalog",
    title: "Product catalog",
    description:
      "Manage sellable products, categories, publishing, imagery, and merchandising readiness.",
    notice: "Catalog page loaded with product publishing controls.",
    actionLabel: "New product",
    primaryPanelTitle: "Catalog queue",
    workflowTitle: "Catalog workflow",
    metrics: [
      { label: "Published", value: "42", detail: "Live products" },
      { label: "Drafts", value: "8", detail: "Need content review" },
      { label: "Images", value: "96%", detail: "Assets attached" },
      { label: "Margins", value: "41%", detail: "Average target" }
    ],
    rows: [
      {
        primary: "Kin Carry Tote",
        secondary: "Bags / ready for featured collection",
        meta: "$129 AUD",
        status: "Published",
        tone: "fulfilled"
      },
      {
        primary: "Studio Ceramic Cup",
        secondary: "Home / low stock affects campaign",
        meta: "$38 AUD",
        status: "Review",
        tone: "warning"
      },
      {
        primary: "Ops Bundle",
        secondary: "Bundles / API-created product",
        meta: "$118 AUD",
        status: "Draft",
        tone: "pending"
      }
    ],
    workflow: [
      {
        title: "Product setup",
        description: "Create SKUs, attach images, assign categories, and set stock thresholds."
      },
      {
        title: "Publishing review",
        description: "Check descriptions, price, margin, availability, and channel visibility."
      },
      {
        title: "Merchandising",
        description: "Pin products into storefront collections and seasonal campaigns."
      }
    ]
  },
  orders: {
    key: "orders",
    overline: "Orders",
    title: "Order management",
    description:
      "Track order status, payment progress, customer requests, and fulfillment handoffs.",
    notice: "Orders page is connected to fulfillment-focused actions.",
    actionLabel: "Create order",
    primaryPanelTitle: "Order queue",
    workflowTitle: "Order workflow",
    metrics: [
      { label: "Open", value: "18", detail: "Awaiting action" },
      { label: "Paid", value: "12", detail: "Ready to pack" },
      { label: "AOV", value: "$103", detail: "30-day average" },
      { label: "Exceptions", value: "3", detail: "Need support" }
    ],
    rows: [
      {
        primary: "SC-1007",
        secondary: "marie@example.com / web",
        meta: "$167",
        status: "Paid",
        tone: "paid"
      },
      {
        primary: "SC-1008",
        secondary: "ops@example.com / wholesale",
        meta: "$92",
        status: "Packing",
        tone: "packing"
      },
      {
        primary: "SC-1009",
        secondary: "sam@example.com / phone",
        meta: "$184",
        status: "Pending",
        tone: "pending"
      }
    ],
    workflow: [
      {
        title: "Payment review",
        description: "Confirm payment status before stock is released to the warehouse."
      },
      {
        title: "Packing handoff",
        description: "Move paid orders into the active fulfillment queue."
      },
      {
        title: "Customer updates",
        description: "Keep support informed when orders are delayed or changed."
      }
    ]
  },
  customers: {
    key: "customers",
    overline: "Customers",
    title: "Customer workspace",
    description:
      "See customer profiles, recent orders, support flags, and loyalty segments.",
    notice: "Customer page is ready for profile and service workflows.",
    actionLabel: "Add note",
    primaryPanelTitle: "Customer list",
    workflowTitle: "Customer workflow",
    metrics: [
      { label: "Customers", value: "1,284", detail: "Total profiles" },
      { label: "Repeat rate", value: "38%", detail: "90-day repeat" },
      { label: "VIPs", value: "74", detail: "High-value segment" },
      { label: "Open tickets", value: "9", detail: "Support follow-up" }
    ],
    rows: [
      {
        primary: "Marie Johnson",
        secondary: "3 orders / VIP segment",
        meta: "$416 LTV",
        status: "Active",
        tone: "fulfilled"
      },
      {
        primary: "Sam Wilson",
        secondary: "Delivery question on SC-1009",
        meta: "1 ticket",
        status: "Support",
        tone: "warning"
      },
      {
        primary: "Operations Buyer",
        secondary: "Wholesale account / net terms",
        meta: "$1,240 LTV",
        status: "B2B",
        tone: "paid"
      }
    ],
    workflow: [
      {
        title: "Profile lookup",
        description: "Find order history, shipping details, and service context quickly."
      },
      {
        title: "Support notes",
        description: "Capture customer promises and operational follow-up tasks."
      },
      {
        title: "Segments",
        description: "Assign loyalty, wholesale, and retention tags for campaigns."
      }
    ]
  },
  inventory: {
    key: "inventory",
    overline: "Inventory",
    title: "Inventory control",
    description:
      "Monitor stock levels, restock thresholds, transfers, and low-stock exceptions.",
    notice: "Inventory page highlights stock risk and restock workflows.",
    actionLabel: "Stock event",
    primaryPanelTitle: "Stock watchlist",
    workflowTitle: "Inventory workflow",
    metrics: [
      { label: "SKUs", value: "58", detail: "Tracked items" },
      { label: "Low stock", value: "6", detail: "Below threshold" },
      { label: "Incoming", value: "14", detail: "Purchase orders" },
      { label: "Accuracy", value: "98%", detail: "Cycle count" }
    ],
    rows: [
      {
        primary: "Studio Ceramic Cup",
        secondary: "Home / threshold 12",
        meta: "7 left",
        status: "Low stock",
        tone: "warning"
      },
      {
        primary: "Foldaway Market Crate",
        secondary: "Utility / threshold 10",
        meta: "4 left",
        status: "Restock",
        tone: "warning"
      },
      {
        primary: "Kin Carry Tote",
        secondary: "Bags / threshold 10",
        meta: "40 left",
        status: "Healthy",
        tone: "fulfilled"
      }
    ],
    workflow: [
      {
        title: "Restock planning",
        description: "Prioritize low-stock products and incoming purchase orders."
      },
      {
        title: "Stock movement",
        description: "Log manual adjustments, returns, damages, and transfers."
      },
      {
        title: "Threshold tuning",
        description: "Set alerts by sales velocity and campaign demand."
      }
    ]
  },
  pricing: {
    key: "pricing",
    overline: "Pricing",
    title: "Pricing rules",
    description:
      "Manage price books, margin checks, regional pricing, and wholesale overrides.",
    notice: "Pricing page keeps margin and channel rules visible.",
    actionLabel: "New price rule",
    primaryPanelTitle: "Price book",
    workflowTitle: "Pricing workflow",
    metrics: [
      { label: "Rules", value: "16", detail: "Active price rules" },
      { label: "Margin floor", value: "32%", detail: "Minimum target" },
      { label: "Wholesale", value: "5", detail: "Contract rates" },
      { label: "Review", value: "2", detail: "Needs approval" }
    ],
    rows: [
      {
        primary: "Retail AUD",
        secondary: "Default storefront price book",
        meta: "Live",
        status: "Active",
        tone: "fulfilled"
      },
      {
        primary: "Wholesale Tier A",
        secondary: "Applies to approved B2B customers",
        meta: "-18%",
        status: "Active",
        tone: "paid"
      },
      {
        primary: "Launch Bundle",
        secondary: "Bundles category margin review",
        meta: "31%",
        status: "Review",
        tone: "warning"
      }
    ],
    workflow: [
      {
        title: "Margin guardrails",
        description: "Prevent pricing changes below approved product margin floors."
      },
      {
        title: "Channel pricing",
        description: "Keep retail, wholesale, and promotional price books separate."
      },
      {
        title: "Approval trail",
        description: "Review exceptions before new prices go live."
      }
    ]
  },
  discounts: {
    key: "discounts",
    overline: "Discounts",
    title: "Discount campaigns",
    description:
      "Create promotional codes, monitor usage, and protect margin during campaigns.",
    notice: "Discounts page has real campaign and promo-code destinations.",
    actionLabel: "New discount",
    primaryPanelTitle: "Campaigns",
    workflowTitle: "Discount workflow",
    metrics: [
      { label: "Active", value: "4", detail: "Live campaigns" },
      { label: "Redemptions", value: "326", detail: "This month" },
      { label: "Revenue", value: "$18.4k", detail: "Discounted sales" },
      { label: "Guardrails", value: "2", detail: "Margin warnings" }
    ],
    rows: [
      {
        primary: "WELCOME10",
        secondary: "New customer acquisition",
        meta: "10% off",
        status: "Active",
        tone: "fulfilled"
      },
      {
        primary: "BUNDLE15",
        secondary: "Bundle attach-rate test",
        meta: "15% off",
        status: "Review",
        tone: "warning"
      },
      {
        primary: "VIPSHIP",
        secondary: "Free shipping for VIP segment",
        meta: "74 users",
        status: "Active",
        tone: "paid"
      }
    ],
    workflow: [
      {
        title: "Campaign setup",
        description: "Define code, audience, eligible SKUs, dates, and redemption limits."
      },
      {
        title: "Margin check",
        description: "Review campaign impact before a discount goes live."
      },
      {
        title: "Performance review",
        description: "Track redemptions, revenue, and repeat purchase lift."
      }
    ]
  },
  reports: {
    key: "reports",
    overline: "Reports",
    title: "Business reports",
    description:
      "Review sales, inventory, fulfillment, and customer performance in one place.",
    notice: "Reports page is ready for operational analytics.",
    actionLabel: "Export report",
    primaryPanelTitle: "Saved reports",
    workflowTitle: "Reporting workflow",
    metrics: [
      { label: "Revenue", value: "$128k", detail: "30-day sales" },
      { label: "Orders", value: "1,246", detail: "30-day orders" },
      { label: "Fulfillment", value: "97.3%", detail: "On-time rate" },
      { label: "Inventory risk", value: "6", detail: "Low-stock SKUs" }
    ],
    rows: [
      {
        primary: "Daily commerce pulse",
        secondary: "Revenue, orders, conversion",
        meta: "Today",
        status: "Ready",
        tone: "fulfilled"
      },
      {
        primary: "Inventory risk",
        secondary: "Low stock and supplier lead times",
        meta: "Weekly",
        status: "Ready",
        tone: "paid"
      },
      {
        primary: "Campaign ROI",
        secondary: "Discount and marketing performance",
        meta: "Monthly",
        status: "Draft",
        tone: "pending"
      }
    ],
    workflow: [
      {
        title: "Snapshot",
        description: "Review the current operating picture without leaving the dashboard."
      },
      {
        title: "Export",
        description: "Send CSV-ready summaries to finance and operations teams."
      },
      {
        title: "Decision log",
        description: "Tie follow-up actions to the metrics that triggered them."
      }
    ]
  },
  fulfillment: {
    key: "fulfillment",
    overline: "Fulfillment",
    title: "Fulfillment board",
    description:
      "Move paid orders through picking, packing, courier handoff, and delivery updates.",
    notice: "Fulfillment page separates warehouse tasks from order support.",
    actionLabel: "Batch pick",
    primaryPanelTitle: "Packing queue",
    workflowTitle: "Fulfillment workflow",
    metrics: [
      { label: "To pick", value: "12", detail: "Paid orders" },
      { label: "Packing", value: "8", detail: "In progress" },
      { label: "Shipped", value: "68", detail: "Today" },
      { label: "Late", value: "2", detail: "Needs attention" }
    ],
    rows: [
      {
        primary: "SC-1008",
        secondary: "2 journals / standard shipping",
        meta: "Aisle B",
        status: "Packing",
        tone: "packing"
      },
      {
        primary: "SC-1010",
        secondary: "Lamp and tote / courier label ready",
        meta: "Aisle C",
        status: "Pick",
        tone: "pending"
      },
      {
        primary: "SC-1011",
        secondary: "Crate order / address check",
        meta: "Hold",
        status: "Issue",
        tone: "warning"
      }
    ],
    workflow: [
      {
        title: "Pick list",
        description: "Group orders by product location and shipping priority."
      },
      {
        title: "Pack verification",
        description: "Confirm quantities and add tracking before handoff."
      },
      {
        title: "Delivery update",
        description: "Move shipped orders back to customer support context."
      }
    ]
  },
  returns: {
    key: "returns",
    overline: "Returns",
    title: "Returns desk",
    description:
      "Review return requests, refund status, restock decisions, and customer outcomes.",
    notice: "Returns page gives support a proper post-purchase workspace.",
    actionLabel: "Create return",
    primaryPanelTitle: "Return requests",
    workflowTitle: "Returns workflow",
    metrics: [
      { label: "Open RMAs", value: "7", detail: "Awaiting action" },
      { label: "Refunds", value: "$842", detail: "Pending approval" },
      { label: "Restockable", value: "5", detail: "Expected items" },
      { label: "Rate", value: "2.8%", detail: "30-day returns" }
    ],
    rows: [
      {
        primary: "RMA-204",
        secondary: "Studio Ceramic Cup / damaged in transit",
        meta: "$38",
        status: "Approve",
        tone: "warning"
      },
      {
        primary: "RMA-205",
        secondary: "Kin Carry Tote / exchange requested",
        meta: "$129",
        status: "Open",
        tone: "pending"
      },
      {
        primary: "RMA-206",
        secondary: "Field Journal Set / restockable",
        meta: "$46",
        status: "Received",
        tone: "paid"
      }
    ],
    workflow: [
      {
        title: "Eligibility",
        description: "Check window, condition, and customer history before approval."
      },
      {
        title: "Resolution",
        description: "Choose refund, exchange, credit, or manual support follow-up."
      },
      {
        title: "Inventory outcome",
        description: "Mark items as restockable, damaged, or supplier claim."
      }
    ]
  },
  marketing: {
    key: "marketing",
    overline: "Marketing",
    title: "Marketing planner",
    description:
      "Coordinate campaigns, product launches, audience segments, and promo performance.",
    notice: "Marketing page connects campaigns to catalog and discount work.",
    actionLabel: "New campaign",
    primaryPanelTitle: "Campaign calendar",
    workflowTitle: "Marketing workflow",
    metrics: [
      { label: "Campaigns", value: "6", detail: "Active or planned" },
      { label: "CTR", value: "4.2%", detail: "Email average" },
      { label: "Revenue", value: "$22k", detail: "Attributed sales" },
      { label: "Segments", value: "11", detail: "Audience groups" }
    ],
    rows: [
      {
        primary: "Winter Home Edit",
        secondary: "Home and workspace products",
        meta: "Jun 18",
        status: "Scheduled",
        tone: "paid"
      },
      {
        primary: "VIP Free Shipping",
        secondary: "VIP segment with VIPSHIP discount",
        meta: "Live",
        status: "Active",
        tone: "fulfilled"
      },
      {
        primary: "Bundle Attach Test",
        secondary: "Ops Bundle product campaign",
        meta: "Draft",
        status: "Review",
        tone: "warning"
      }
    ],
    workflow: [
      {
        title: "Audience",
        description: "Select segments using customer, order, and product data."
      },
      {
        title: "Offer",
        description: "Attach discounts, products, landing pages, and guardrails."
      },
      {
        title: "Performance",
        description: "Compare campaign revenue against discount and channel costs."
      }
    ]
  },
  apps: {
    key: "apps",
    overline: "Apps",
    title: "Connected apps",
    description:
      "Manage operational integrations for shipping, email, analytics, and finance.",
    notice: "Apps page gives integrations their own destination.",
    actionLabel: "Connect app",
    primaryPanelTitle: "Integrations",
    workflowTitle: "Integration workflow",
    metrics: [
      { label: "Connected", value: "5", detail: "Operational apps" },
      { label: "Sync health", value: "99%", detail: "Last 24 hours" },
      { label: "Alerts", value: "1", detail: "Needs attention" },
      { label: "Automations", value: "9", detail: "Active flows" }
    ],
    rows: [
      {
        primary: "Supabase",
        secondary: "Auth, database, and RLS backend",
        meta: "Core",
        status: "Ready",
        tone: "fulfilled"
      },
      {
        primary: "Courier labels",
        secondary: "Shipping and fulfillment labels",
        meta: "Ops",
        status: "Connected",
        tone: "paid"
      },
      {
        primary: "Email service",
        secondary: "Order and campaign messaging",
        meta: "Comms",
        status: "Review",
        tone: "warning"
      }
    ],
    workflow: [
      {
        title: "Connection",
        description: "Configure app credentials and scope only the required access."
      },
      {
        title: "Data mapping",
        description: "Map product, order, customer, and fulfillment fields."
      },
      {
        title: "Monitoring",
        description: "Watch sync health and capture errors for support."
      }
    ]
  },
  team: {
    key: "team",
    overline: "Team",
    title: "Team workspace",
    description:
      "Invite staff, review account status, and assign responsibilities.",
    notice: "Team page is a proper destination for staff management.",
    actionLabel: "Invite user",
    primaryPanelTitle: "Team members",
    workflowTitle: "Team workflow",
    metrics: [
      { label: "Staff", value: "4", detail: "Active profiles" },
      { label: "Invites", value: "1", detail: "Pending acceptance" },
      { label: "Admins", value: "1", detail: "Full access" },
      { label: "Coverage", value: "3", detail: "Ops functions" }
    ],
    rows: [
      {
        primary: "NexaCart Admin",
        secondary: "admin@nexacart.local",
        meta: "Admin",
        status: "Active",
        tone: "fulfilled"
      },
      {
        primary: "Operations Lead",
        secondary: "operations@example.com",
        meta: "Operations",
        status: "Active",
        tone: "paid"
      },
      {
        primary: "Support Agent",
        secondary: "support@example.com",
        meta: "Support",
        status: "Invited",
        tone: "pending"
      }
    ],
    workflow: [
      {
        title: "Invite",
        description: "Send Supabase Auth invitations with a starting business role."
      },
      {
        title: "Review",
        description: "Confirm status, ownership area, and escalation path."
      },
      {
        title: "Deactivate",
        description: "Suspend access while preserving the audit trail."
      }
    ]
  },
  roles: {
    key: "roles",
    overline: "Roles",
    title: "Roles and permissions",
    description:
      "Review business roles, permission boundaries, and protected actions.",
    notice: "Roles page explains permission coverage for the app.",
    actionLabel: "Review role",
    primaryPanelTitle: "Role matrix",
    workflowTitle: "Permission workflow",
    metrics: [
      { label: "Roles", value: "5", detail: "Defined roles" },
      { label: "Protected APIs", value: "7", detail: "Route handlers" },
      { label: "RLS tables", value: "5", detail: "Protected tables" },
      { label: "Admin-only", value: "3", detail: "Staff actions" }
    ],
    rows: [
      {
        primary: "Admin",
        secondary: "Manage products, orders, staff, and settings",
        meta: "Full access",
        status: "Active",
        tone: "fulfilled"
      },
      {
        primary: "Inventory manager",
        secondary: "Products, stock events, and low-stock review",
        meta: "Inventory",
        status: "Scoped",
        tone: "paid"
      },
      {
        primary: "Customer",
        secondary: "Storefront, checkout, and own orders",
        meta: "Self-service",
        status: "Limited",
        tone: "pending"
      }
    ],
    workflow: [
      {
        title: "Assign",
        description: "Store business roles in profiles instead of user-editable metadata."
      },
      {
        title: "Enforce",
        description: "Apply role checks in API routes and Supabase RLS policies."
      },
      {
        title: "Audit",
        description: "Review changes when staff responsibilities shift."
      }
    ]
  },
  settings: {
    key: "settings",
    overline: "Settings",
    title: "Store settings",
    description:
      "Manage checkout defaults, store identity, notifications, and operational preferences.",
    notice: "Settings page gives store configuration a clear home.",
    actionLabel: "Save setting",
    primaryPanelTitle: "Configuration",
    workflowTitle: "Settings workflow",
    metrics: [
      { label: "Checkout", value: "Live", detail: "Demo mode enabled" },
      { label: "Currency", value: "AUD", detail: "Store default" },
      { label: "Notifications", value: "6", detail: "Configured events" },
      { label: "Policies", value: "4", detail: "Published pages" }
    ],
    rows: [
      {
        primary: "Store identity",
        secondary: "NexaCart Commerce Cloud",
        meta: "Brand",
        status: "Current",
        tone: "fulfilled"
      },
      {
        primary: "Checkout address",
        secondary: "Requires shipping name and address",
        meta: "Required",
        status: "Active",
        tone: "paid"
      },
      {
        primary: "Demo auth",
        secondary: "Disable before production deployment",
        meta: "Env",
        status: "Review",
        tone: "warning"
      }
    ],
    workflow: [
      {
        title: "Configure",
        description: "Set global store defaults and operational rules."
      },
      {
        title: "Validate",
        description: "Confirm settings align with production security expectations."
      },
      {
        title: "Publish",
        description: "Apply configuration changes after review."
      }
    ]
  },
  billing: {
    key: "billing",
    overline: "Billing",
    title: "Billing center",
    description:
      "Review invoices, payment methods, tax settings, and subscription ownership.",
    notice: "Billing page is separate from customer checkout billing.",
    actionLabel: "Add method",
    primaryPanelTitle: "Billing items",
    workflowTitle: "Billing workflow",
    metrics: [
      { label: "Plan", value: "Growth", detail: "Current tier" },
      { label: "Invoices", value: "12", detail: "This year" },
      { label: "Due", value: "$0", detail: "No open balance" },
      { label: "Tax", value: "AU", detail: "Region settings" }
    ],
    rows: [
      {
        primary: "June invoice",
        secondary: "Platform subscription",
        meta: "$149",
        status: "Paid",
        tone: "fulfilled"
      },
      {
        primary: "Payment method",
        secondary: "Business card ending 1770",
        meta: "Primary",
        status: "Active",
        tone: "paid"
      },
      {
        primary: "Tax profile",
        secondary: "Australian business settings",
        meta: "GST",
        status: "Review",
        tone: "pending"
      }
    ],
    workflow: [
      {
        title: "Invoice review",
        description: "Track paid and upcoming app operating costs."
      },
      {
        title: "Payment methods",
        description: "Keep one primary billing method ready for renewals."
      },
      {
        title: "Ownership",
        description: "Restrict billing changes to admin users."
      }
    ]
  },
  activity: {
    key: "activity",
    overline: "Activity",
    title: "Activity log",
    description:
      "Review important business events across products, orders, users, and settings.",
    notice: "Activity page gives audit events a real destination.",
    actionLabel: "Export log",
    primaryPanelTitle: "Recent activity",
    workflowTitle: "Audit workflow",
    metrics: [
      { label: "Events", value: "148", detail: "Last 24 hours" },
      { label: "Admin changes", value: "9", detail: "Role or settings" },
      { label: "API writes", value: "32", detail: "Protected actions" },
      { label: "Warnings", value: "2", detail: "Need review" }
    ],
    rows: [
      {
        primary: "Product created",
        secondary: "Ops Bundle added through products API",
        meta: "Admin",
        status: "Logged",
        tone: "fulfilled"
      },
      {
        primary: "Order created",
        secondary: "Checkout API created a pending order",
        meta: "Customer",
        status: "Logged",
        tone: "paid"
      },
      {
        primary: "Permission denied",
        secondary: "Customer role blocked from product creation",
        meta: "403",
        status: "Review",
        tone: "warning"
      }
    ],
    workflow: [
      {
        title: "Capture",
        description: "Log important protected operations and permission failures."
      },
      {
        title: "Investigate",
        description: "Filter by user, role, resource, and API route."
      },
      {
        title: "Export",
        description: "Share evidence for compliance or incident review."
      }
    ]
  }
} satisfies Record<string, BusinessPageConfig>;
