import { StorefrontShell } from "@/components/storefront-shell";
import { seedOrders, seedProducts, seedTeam } from "@/lib/data";

export default function Home() {
  return (
    <StorefrontShell
      initialOrders={seedOrders}
      initialProducts={seedProducts}
      initialTeam={seedTeam}
    />
  );
}
