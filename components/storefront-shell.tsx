"use client";

import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import clsx from "clsx";
import {
  AlertTriangle,
  BarChart3,
  Boxes,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  LayoutDashboard,
  Lock,
  Minus,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Trash2,
  Truck,
  UserCog,
  Users
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import {
  roleDescriptions,
  roleLabels,
  rolePermissions,
  type CartLine,
  type Order,
  type Product,
  type Role,
  type TeamMember
} from "@/lib/types";
import { currency } from "@/lib/data";

type View = "store" | "admin";
type AdminTab = "overview" | "inventory" | "orders" | "team";

type StorefrontShellProps = {
  defaultView?: View;
  initialProducts: Product[];
  initialOrders: Order[];
  initialTeam: TeamMember[];
};

const adminTabs: Array<{
  id: AdminTab;
  label: string;
  icon: ComponentType<{ size?: number }>;
}> = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "inventory", label: "Inventory", icon: Boxes },
  { id: "orders", label: "Orders", icon: Truck },
  { id: "team", label: "Team", icon: Users }
];

const roleOptions: Role[] = [
  "customer",
  "support",
  "inventory_manager",
  "operations_manager",
  "admin"
];

export function StorefrontShell({
  defaultView = "store",
  initialProducts,
  initialOrders,
  initialTeam
}: StorefrontShellProps) {
  const view = defaultView;
  const [adminTab, setAdminTab] = useState<AdminTab>("overview");
  const [role, setRole] = useState<Role>(
    defaultView === "admin" ? "admin" : "customer"
  );
  const [products, setProducts] = useState(initialProducts);
  const [orders, setOrders] = useState(initialOrders);
  const [team, setTeam] = useState(initialTeam);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("Ready for checkout and operations.");
  const [isBusy, setIsBusy] = useState(false);

  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  async function authHeaders() {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "x-demo-role": role
    };

    const session = supabase ? await supabase.auth.getSession() : null;
    const token = session?.data.session?.access_token;
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    return headers;
  }

  async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const response = await fetch(url, {
      ...init,
      headers: {
        ...(await authHeaders()),
        ...init?.headers
      }
    });
    const json = await response.json();

    if (!response.ok) {
      throw new Error(json.error ?? "Request failed.");
    }

    return json as T;
  }

  async function loadProducts(admin = false) {
    const data = await fetchJson<{ products: Product[] }>(
      `/api/products${admin ? "?admin=true" : ""}`
    );
    setProducts(data.products);
  }

  async function loadAdminData() {
    if (role === "customer") {
      return;
    }

    const [ordersData, teamData] = await Promise.all([
      fetchJson<{ orders: Order[] }>("/api/orders"),
      role === "admin"
        ? fetchJson<{ team: TeamMember[] }>("/api/admin/team")
        : Promise.resolve({ team })
    ]);
    setOrders(ordersData.orders);
    setTeam(teamData.team);
  }

  useEffect(() => {
    loadProducts(view === "admin").catch((error) => setNotice(error.message));
  }, [role, view]);

  useEffect(() => {
    if (view === "admin") {
      loadAdminData().catch((error) => setNotice(error.message));
    }
  }, [role, view, adminTab]);

  const filteredProducts = products.filter((product) => {
    const haystack = `${product.name} ${product.category} ${product.description}`;
    return haystack.toLowerCase().includes(query.toLowerCase());
  });

  const cartTotal = cart.reduce(
    (sum, line) => sum + line.product.price * line.quantity,
    0
  );
  const lowStock = products.filter(
    (product) => product.stock <= product.low_stock_threshold
  );
  const paidRevenue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((sum, order) => sum + order.total, 0);
  const activeOrders = orders.filter((order) =>
    ["pending", "paid", "packing"].includes(order.status)
  );

  function addToCart(product: Product) {
    setCart((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) {
        return current.map((line) =>
          line.product.id === product.id
            ? { ...line, quantity: Math.min(line.quantity + 1, 20) }
            : line
        );
      }

      return [...current, { product, quantity: 1 }];
    });
  }

  function updateQuantity(productId: string, quantity: number) {
    setCart((current) =>
      current
        .map((line) =>
          line.product.id === productId
            ? { ...line, quantity: Math.max(1, quantity) }
            : line
        )
        .filter((line) => line.quantity > 0)
    );
  }

  async function checkout() {
    if (!cart.length) {
      setNotice("Add at least one product before checkout.");
      return;
    }

    setIsBusy(true);
    try {
      const data = await fetchJson<{ order: Order }>("/api/checkout", {
        method: "POST",
        body: JSON.stringify({
          customer_email: "customer@example.com",
          shipping_name: "Demo Customer",
          shipping_address: "44 Commerce Lane, Melbourne VIC",
          items: cart.map((line) => ({
            product_id: line.product.id,
            quantity: line.quantity
          }))
        })
      });

      setCart([]);
      setOrders((current) => [data.order, ...current]);
      await loadProducts(view === "admin");
      setNotice(`Order ${data.order.order_number} created successfully.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Checkout failed.");
    } finally {
      setIsBusy(false);
    }
  }

  async function addProduct() {
    setIsBusy(true);
    try {
      const data = await fetchJson<{ product: Product }>("/api/products", {
        method: "POST",
        body: JSON.stringify({
          name: "Ops Bundle",
          category: "Bundles",
          description:
            "A curated kit for testing the protected product creation API.",
          price: 118,
          stock: 24,
          low_stock_threshold: 6,
          image_url:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
          is_published: true
        })
      });
      setProducts((current) => [data.product, ...current]);
      setNotice(`${data.product.name} added through the products API.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not add product.");
    } finally {
      setIsBusy(false);
    }
  }

  async function updateOrderStatus(order: Order) {
    const nextStatus =
      order.status === "pending"
        ? "paid"
        : order.status === "paid"
          ? "packing"
          : "fulfilled";

    try {
      const data = await fetchJson<{ order: Order }>("/api/orders", {
        method: "PATCH",
        body: JSON.stringify({
          order_id: order.id,
          status: nextStatus
        })
      });

      setOrders((current) =>
        current.map((item) =>
          item.id === order.id ? { ...item, status: data.order.status } : item
        )
      );
      setNotice(`${order.order_number} moved to ${nextStatus}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not update order.");
    }
  }

  async function updateTeamRole(member: TeamMember, nextRole: Role) {
    try {
      const data = await fetchJson<{ member: TeamMember }>("/api/admin/team", {
        method: "PATCH",
        body: JSON.stringify({
          user_id: member.id,
          role: nextRole
        })
      });
      setTeam((current) =>
        current.map((item) => (item.id === member.id ? data.member : item))
      );
      setNotice(`${member.email} updated to ${roleLabels[nextRole]}.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not update role.");
    }
  }

  return (
    <main className="app-shell">
      <AppSidebar role={role} onRoleChange={setRole} />

      <section className="workspace">
        <header className="topbar">
          <div className="search-box">
            <Search size={17} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search products, categories, or orders"
              suppressHydrationWarning
            />
          </div>

          <div className="topbar-actions">
            <button className="button secondary" onClick={() => loadProducts(view === "admin")} type="button">
              <RefreshCw size={16} />
              Sync
            </button>
            <div className="role-chip">
              <UserCog size={16} />
              {roleLabels[role]}
            </div>
          </div>
        </header>

        <div className="notice-line" role="status">
          <CheckCircle2 size={17} />
          {notice}
        </div>

        {view === "store" ? (
          <div className="store-grid">
            <section className="catalog-panel">
              <div className="section-title-row">
                <div>
                  <p className="overline">Live catalog</p>
                  <h1>Premium everyday goods</h1>
                </div>
                <span>{filteredProducts.length} products</span>
              </div>

              <div className="product-grid">
                {filteredProducts.map((product) => (
                  <article className="product-card" key={product.id}>
                    <img src={product.image_url} alt="" />
                    <div className="product-card-body">
                      <div>
                        <span className="product-category">{product.category}</span>
                        <h2>{product.name}</h2>
                        <p>{product.description}</p>
                      </div>
                      <div className="product-card-footer">
                        <strong>{currency(product.price, product.currency)}</strong>
                        <button
                          className="icon-button"
                          onClick={() => addToCart(product)}
                          type="button"
                          aria-label={`Add ${product.name} to cart`}
                        >
                          <Plus size={17} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <aside className="cart-panel">
              <div className="section-heading">
                <CreditCard size={18} />
                Checkout
              </div>

              <div className="cart-lines">
                {cart.length ? (
                  cart.map((line) => (
                    <div className="cart-line" key={line.product.id}>
                      <div>
                        <strong>{line.product.name}</strong>
                        <span>
                          {line.quantity} x {currency(line.product.price)}
                        </span>
                      </div>
                      <div className="quantity-control">
                        <button
                          onClick={() =>
                            updateQuantity(line.product.id, line.quantity - 1)
                          }
                          type="button"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span>{line.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(line.product.id, line.quantity + 1)
                          }
                          type="button"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                        <button
                          onClick={() =>
                            setCart((current) =>
                              current.filter(
                                (item) => item.product.id !== line.product.id
                              )
                            )
                          }
                          type="button"
                          aria-label="Remove item"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="empty-state">Cart items will appear here.</p>
                )}
              </div>

              <div className="cart-total">
                <span>Total</span>
                <strong>{currency(cartTotal)}</strong>
              </div>
              <button
                className="button primary full"
                disabled={isBusy}
                onClick={checkout}
                type="button"
              >
                Create order
                <ChevronRight size={16} />
              </button>
            </aside>
          </div>
        ) : (
          <div className="admin-layout">
            <div className="admin-tabs" role="tablist" aria-label="Internal tools">
              {adminTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    className={clsx("tab-button", adminTab === tab.id && "active")}
                    key={tab.id}
                    onClick={() => setAdminTab(tab.id)}
                    type="button"
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {role === "customer" ? (
              <section className="locked-panel">
                <Lock size={32} />
                <h1>Internal tools require a staff role</h1>
                <p>
                  Switch the demo role or sign in with a Supabase account whose
                  profile role has staff permissions.
                </p>
              </section>
            ) : (
              <AdminContent
                activeOrders={activeOrders}
                adminTab={adminTab}
                addProduct={addProduct}
                isBusy={isBusy}
                lowStock={lowStock}
                orders={orders}
                paidRevenue={paidRevenue}
                products={products}
                role={role}
                team={team}
                updateOrderStatus={updateOrderStatus}
                updateTeamRole={updateTeamRole}
              />
            )}
          </div>
        )}
      </section>
    </main>
  );
}

function AdminContent({
  activeOrders,
  adminTab,
  addProduct,
  isBusy,
  lowStock,
  orders,
  paidRevenue,
  products,
  role,
  team,
  updateOrderStatus,
  updateTeamRole
}: {
  activeOrders: Order[];
  adminTab: AdminTab;
  addProduct: () => Promise<void>;
  isBusy: boolean;
  lowStock: Product[];
  orders: Order[];
  paidRevenue: number;
  products: Product[];
  role: Role;
  team: TeamMember[];
  updateOrderStatus: (order: Order) => Promise<void>;
  updateTeamRole: (member: TeamMember, role: Role) => Promise<void>;
}) {
  if (adminTab === "inventory") {
    return (
      <section className="panel-stack">
        <div className="section-title-row">
          <div>
            <p className="overline">Inventory control</p>
            <h1>Product and stock management</h1>
          </div>
          <button
            className="button primary"
            disabled={
              isBusy ||
              !["inventory_manager", "operations_manager", "admin"].includes(role)
            }
            onClick={addProduct}
            type="button"
          >
            <Plus size={16} />
            Add product
          </button>
        </div>
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Stock</th>
                <th>Threshold</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.stock}</td>
                  <td>{product.low_stock_threshold}</td>
                  <td>
                    <span
                      className={clsx(
                        "status-pill",
                        product.stock <= product.low_stock_threshold && "warning"
                      )}
                    >
                      {product.stock <= product.low_stock_threshold
                        ? "Low stock"
                        : "Healthy"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  }

  if (adminTab === "orders") {
    return (
      <section className="panel-stack">
        <div className="section-title-row">
          <div>
            <p className="overline">Fulfillment queue</p>
            <h1>Orders requiring attention</h1>
          </div>
          <span>{orders.length} orders</span>
        </div>
        <OrdersTable orders={orders} updateOrderStatus={updateOrderStatus} />
      </section>
    );
  }

  if (adminTab === "team") {
    return (
      <section className="panel-stack">
        <div className="section-title-row">
          <div>
            <p className="overline">Access control</p>
            <h1>Staff accounts and permissions</h1>
          </div>
          <span>{roleLabels[role]}</span>
        </div>
        <div className="team-grid">
          {team.map((member) => (
            <article className="team-card" key={member.id}>
              <div>
                <strong>{member.full_name}</strong>
                <span>{member.email}</span>
              </div>
              <select
                disabled={role !== "admin"}
                value={member.role}
                onChange={(event) =>
                  updateTeamRole(member, event.target.value as Role)
                }
              >
                {roleOptions.map((item) => (
                  <option key={item} value={item}>
                    {roleLabels[item]}
                  </option>
                ))}
              </select>
              <p>{roleDescriptions[member.role]}</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="panel-stack">
      <div className="section-title-row">
        <div>
          <p className="overline">Dashboard</p>
          <h1>Operations dashboard</h1>
        </div>
        <span>{roleLabels[role]}</span>
      </div>

      <div className="metric-grid">
        <MetricCard
          icon={BarChart3}
          label="Revenue"
          value={currency(paidRevenue)}
          detail="Non-cancelled order total"
        />
        <MetricCard
          icon={Truck}
          label="Active orders"
          value={activeOrders.length.toString()}
          detail="Pending, paid, or packing"
        />
        <MetricCard
          icon={AlertTriangle}
          label="Low-stock SKUs"
          value={lowStock.length.toString()}
          detail="Inventory at or below threshold"
        />
        <MetricCard
          icon={Users}
          label="Staff profiles"
          value={team.length.toString()}
          detail="Profiles with business roles"
        />
      </div>

      <div className="two-column">
        <section className="table-card">
          <div className="section-heading">
            <Package size={18} />
            Inventory alerts
          </div>
          {lowStock.length ? (
            lowStock.map((product) => (
              <div className="alert-row" key={product.id}>
                <div>
                  <strong>{product.name}</strong>
                  <span>
                    {product.stock} left, threshold {product.low_stock_threshold}
                  </span>
                </div>
                <span className="status-pill warning">Restock</span>
              </div>
            ))
          ) : (
            <p className="empty-state">No low-stock items.</p>
          )}
        </section>

        <section className="table-card">
          <div className="section-heading">
            <ShieldCheck size={18} />
            Role permissions
          </div>
          <div className="permission-list">
            {rolePermissions[role].map((permission) => (
              <div key={permission}>
                <CheckCircle2 size={15} />
                {permission}
              </div>
            ))}
          </div>
        </section>
      </div>

      <OrdersTable orders={orders.slice(0, 5)} updateOrderStatus={updateOrderStatus} />
    </section>
  );
}

function MetricCard({
  detail,
  icon: Icon,
  label,
  value
}: {
  detail: string;
  icon: ComponentType<{ size?: number }>;
  label: string;
  value: string;
}) {
  return (
    <article className="metric-card">
      <div className="metric-icon">
        <Icon size={20} />
      </div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

function OrdersTable({
  orders,
  updateOrderStatus
}: {
  orders: Order[];
  updateOrderStatus: (order: Order) => Promise<void>;
}) {
  return (
    <div className="table-card">
      <table>
        <thead>
          <tr>
            <th>Order</th>
            <th>Customer</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.order_number}</td>
              <td>{order.customer_email}</td>
              <td>{currency(order.total, order.currency)}</td>
              <td>
                <span className={clsx("status-pill", order.status)}>
                  {order.status}
                </span>
              </td>
              <td>
                <button
                  className="button small"
                  disabled={order.status === "fulfilled"}
                  onClick={() => updateOrderStatus(order)}
                  type="button"
                >
                  Advance
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
