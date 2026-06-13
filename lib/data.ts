import type { Order, Product, Role, TeamMember } from "@/lib/types";

export const seedProducts: Product[] = [
  {
    id: "prod_kin-carry",
    name: "Kin Carry Tote",
    slug: "kin-carry-tote",
    category: "Bags",
    description: "Structured everyday tote with recycled canvas and a padded laptop sleeve.",
    price: 129,
    currency: "AUD",
    stock: 42,
    low_stock_threshold: 10,
    image_url:
      "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80",
    is_published: true,
    created_at: "2026-06-01T10:00:00.000Z"
  },
  {
    id: "prod-studio-cup",
    name: "Studio Ceramic Cup",
    slug: "studio-ceramic-cup",
    category: "Home",
    description: "Hand-glazed ceramic cup made for slow mornings and desk rituals.",
    price: 38,
    currency: "AUD",
    stock: 8,
    low_stock_threshold: 12,
    image_url:
      "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80",
    is_published: true,
    created_at: "2026-06-02T10:00:00.000Z"
  },
  {
    id: "prod-field-journal",
    name: "Field Journal Set",
    slug: "field-journal-set",
    category: "Stationery",
    description: "Three lay-flat notebooks with archival paper and numbered pages.",
    price: 46,
    currency: "AUD",
    stock: 61,
    low_stock_threshold: 15,
    image_url:
      "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80",
    is_published: true,
    created_at: "2026-06-03T10:00:00.000Z"
  },
  {
    id: "prod-nomad-lamp",
    name: "Nomad Desk Lamp",
    slug: "nomad-desk-lamp",
    category: "Workspace",
    description: "Dimmable aluminium lamp with warm LEDs and a weighted base.",
    price: 184,
    currency: "AUD",
    stock: 13,
    low_stock_threshold: 8,
    image_url:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80",
    is_published: true,
    created_at: "2026-06-04T10:00:00.000Z"
  },
  {
    id: "prod-market-crate",
    name: "Foldaway Market Crate",
    slug: "foldaway-market-crate",
    category: "Utility",
    description: "Stackable utility crate for market runs, studio storage, and deliveries.",
    price: 32,
    currency: "AUD",
    stock: 4,
    low_stock_threshold: 10,
    image_url:
      "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
    is_published: true,
    created_at: "2026-06-05T10:00:00.000Z"
  }
];

export const seedOrders: Order[] = [
  {
    id: "ord_1001",
    order_number: "SC-1001",
    customer_email: "marie@example.com",
    status: "paid",
    total: 167,
    currency: "AUD",
    channel: "web",
    created_at: "2026-06-12T08:10:00.000Z",
    items: [
      {
        product_id: "prod_kin-carry",
        name: "Kin Carry Tote",
        quantity: 1,
        unit_price: 129
      },
      {
        product_id: "prod-studio-cup",
        name: "Studio Ceramic Cup",
        quantity: 1,
        unit_price: 38
      }
    ]
  },
  {
    id: "ord_1002",
    order_number: "SC-1002",
    customer_email: "ops@example.com",
    status: "packing",
    total: 92,
    currency: "AUD",
    channel: "web",
    created_at: "2026-06-12T09:35:00.000Z",
    items: [
      {
        product_id: "prod-field-journal",
        name: "Field Journal Set",
        quantity: 2,
        unit_price: 46
      }
    ]
  },
  {
    id: "ord_1003",
    order_number: "SC-1003",
    customer_email: "sam@example.com",
    status: "pending",
    total: 184,
    currency: "AUD",
    channel: "phone",
    created_at: "2026-06-12T10:20:00.000Z",
    items: [
      {
        product_id: "prod-nomad-lamp",
        name: "Nomad Desk Lamp",
        quantity: 1,
        unit_price: 184
      }
    ]
  }
];

export const seedTeam: TeamMember[] = [
  {
    id: "usr_admin",
    email: "admin@nexacart.local",
    full_name: "NexaCart Admin",
    role: "admin",
    status: "active",
    created_at: "2026-06-01T09:00:00.000Z"
  },
  {
    id: "usr_ops",
    email: "operations@example.com",
    full_name: "Operations Lead",
    role: "operations_manager",
    status: "active",
    created_at: "2026-06-02T09:00:00.000Z"
  },
  {
    id: "usr_inventory",
    email: "inventory@example.com",
    full_name: "Inventory Manager",
    role: "inventory_manager",
    status: "active",
    created_at: "2026-06-03T09:00:00.000Z"
  },
  {
    id: "usr_support",
    email: "support@example.com",
    full_name: "Support Agent",
    role: "support",
    status: "invited",
    created_at: "2026-06-04T09:00:00.000Z"
  }
];

export const demoStore = {
  products: [...seedProducts],
  orders: [...seedOrders],
  team: [...seedTeam]
};

export function currency(value: number, code = "AUD") {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: code,
    maximumFractionDigits: 0
  }).format(value);
}

export function createId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function isStaff(role: Role) {
  return role !== "customer";
}
