import { StorefrontShell } from "@/components/storefront-shell";
import { seedOrders, seedProducts, seedTeam } from "@/lib/data";

export default function AdminWorkspace() {
  return (
    <StorefrontShell
      defaultView="admin"
      initialOrders={seedOrders}
      initialProducts={seedProducts}
      initialTeam={seedTeam}
    />
  );
}
