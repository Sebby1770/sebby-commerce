"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import {
  Activity,
  AppWindow,
  BadgeDollarSign,
  Boxes,
  ChartNoAxesColumn,
  CreditCard,
  Headphones,
  Home,
  LayoutDashboard,
  Megaphone,
  ReceiptText,
  RotateCcw,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Tags,
  Truck,
  UserCog,
  Users
} from "lucide-react";
import { roleDescriptions, roleLabels, type Role } from "@/lib/types";

const demoRoles: Role[] = [
  "customer",
  "support",
  "inventory_manager",
  "operations_manager",
  "admin"
];

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
};

const navGroups: Array<{
  label: string;
  items: NavItem[];
}> = [
  {
    label: "Commerce",
    items: [
      { href: "/", label: "Storefront", icon: Home },
      { href: "/catalog", label: "Catalog", icon: ShoppingBag },
      { href: "/orders", label: "Orders", icon: ReceiptText },
      { href: "/customers", label: "Customers", icon: Headphones },
      { href: "/pricing", label: "Pricing", icon: BadgeDollarSign },
      { href: "/discounts", label: "Discounts", icon: Tags }
    ]
  },
  {
    label: "Operations",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
      { href: "/inventory", label: "Inventory", icon: Boxes },
      { href: "/reports", label: "Reports", icon: ChartNoAxesColumn },
      { href: "/fulfillment", label: "Fulfillment", icon: Truck },
      { href: "/returns", label: "Returns", icon: RotateCcw },
      { href: "/marketing", label: "Marketing", icon: Megaphone },
      { href: "/apps", label: "Apps", icon: AppWindow }
    ]
  },
  {
    label: "Settings",
    items: [
      { href: "/team", label: "Team", icon: Users },
      { href: "/roles", label: "Roles", icon: ShieldCheck },
      { href: "/settings", label: "Store settings", icon: Settings },
      { href: "/billing", label: "Billing", icon: CreditCard },
      { href: "/activity", label: "Activity log", icon: Activity },
      { href: "/signin", label: "User sign in", icon: UserCog }
    ]
  }
];

type AppSidebarProps = {
  role: Role;
  onRoleChange: (role: Role) => void;
};

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppSidebar({ role, onRoleChange }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sidebar" aria-label="Primary navigation">
      <div className="brand-lockup">
        <div className="brand-mark">S</div>
        <div>
          <strong>Sebby Co.</strong>
          <span>Commerce OS</span>
        </div>
      </div>

      <nav className="nav-stack">
        {navGroups.map((group) => (
          <div className="nav-group" key={group.label}>
            <div className="nav-group-label">{group.label}</div>
            {group.items.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  className={clsx(
                    "nav-item",
                    isActive(pathname, item.href) && "active"
                  )}
                  href={item.href}
                  key={item.href}
                >
                  <Icon size={17} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="permission-card">
        <div className="permission-title">
          <ShieldCheck size={16} />
          Demo role
        </div>
        <select
          aria-label="Demo role"
          value={role}
          onChange={(event) => onRoleChange(event.target.value as Role)}
        >
          {demoRoles.map((item) => (
            <option key={item} value={item}>
              {roleLabels[item]}
            </option>
          ))}
        </select>
        <p>{roleDescriptions[role]}</p>
      </div>
    </aside>
  );
}
