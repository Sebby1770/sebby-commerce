export type Role =
  | "customer"
  | "support"
  | "inventory_manager"
  | "operations_manager"
  | "admin";

export type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  currency: string;
  stock: number;
  low_stock_threshold: number;
  image_url: string;
  is_published: boolean;
  created_at: string;
};

export type OrderStatus =
  | "pending"
  | "paid"
  | "packing"
  | "fulfilled"
  | "cancelled";

export type Order = {
  id: string;
  order_number: string;
  customer_email: string;
  status: OrderStatus;
  total: number;
  currency: string;
  channel: "web" | "phone" | "wholesale";
  created_at: string;
  items: Array<{
    product_id: string;
    name: string;
    quantity: number;
    unit_price: number;
  }>;
};

export type TeamMember = {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  status: "active" | "invited" | "suspended";
  created_at: string;
};

export type CartLine = {
  product: Product;
  quantity: number;
};

export const roleLabels: Record<Role, string> = {
  customer: "Customer",
  support: "Support",
  inventory_manager: "Inventory manager",
  operations_manager: "Operations manager",
  admin: "Admin"
};

export const roleDescriptions: Record<Role, string> = {
  customer: "Can shop, check out, and view their own order history.",
  support: "Can view orders and help customers.",
  inventory_manager: "Can update products, stock, and inventory events.",
  operations_manager: "Can manage orders, fulfillment, and inventory workflows.",
  admin: "Can manage products, orders, staff roles, and all business settings."
};

export const rolePermissions: Record<Role, string[]> = {
  customer: ["Browse catalog", "Create checkout", "View own orders"],
  support: ["Browse catalog", "View all orders", "Update customer notes"],
  inventory_manager: [
    "Browse catalog",
    "Create products",
    "Update inventory",
    "View inventory alerts"
  ],
  operations_manager: [
    "Browse catalog",
    "View all orders",
    "Update fulfillment",
    "Manage product operations"
  ],
  admin: [
    "Browse catalog",
    "Manage products",
    "Manage orders",
    "Manage staff roles",
    "View business metrics"
  ]
};

export function roleCan(role: Role, permission: string) {
  return rolePermissions[role].some((item) =>
    item.toLowerCase().includes(permission.toLowerCase())
  );
}
