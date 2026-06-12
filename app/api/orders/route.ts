import { type NextRequest } from "next/server";
import { z } from "zod";
import { demoStore } from "@/lib/data";
import { getAuthContext, isAuthResponse, requireRole } from "@/lib/auth";
import { jsonError, parseBody } from "@/lib/api/response";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import type { OrderStatus } from "@/lib/types";

const statusSchema = z.object({
  order_id: z.string().min(1),
  status: z.enum(["pending", "paid", "packing", "fulfilled", "cancelled"])
});

export async function GET(request: NextRequest) {
  const auth = await getAuthContext(request);
  if (!auth) {
    return jsonError("Authentication required.", 401);
  }

  const admin = getSupabaseAdmin();
  const isStaff = auth.role !== "customer";

  if (admin) {
    let query = admin
      .from("orders")
      .select(
        "id,order_number,customer_email,status,total,currency,channel,created_at,order_items(product_id,name,quantity,unit_price)"
      )
      .order("created_at", { ascending: false });

    if (!isStaff) {
      query = query.eq("customer_id", auth.userId);
    }

    const { data, error } = await query;

    if (error) {
      return jsonError("Could not load orders.", 500, error.message);
    }

    const orders = data.map((order) => ({
      ...order,
      items: order.order_items ?? []
    }));

    return Response.json({ orders });
  }

  const orders = isStaff
    ? demoStore.orders
    : demoStore.orders.filter((order) => order.customer_email === auth.email);

  return Response.json({ orders });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireRole(request, [
    "support",
    "operations_manager",
    "admin"
  ]);

  if (isAuthResponse(auth)) {
    return auth;
  }

  const body = await parseBody(request, statusSchema);
  if (body instanceof Response) {
    return body;
  }

  const admin = getSupabaseAdmin();

  if (admin) {
    const { data, error } = await admin
      .from("orders")
      .update({ status: body.status })
      .eq("id", body.order_id)
      .select("id,order_number,customer_email,status,total,currency,channel,created_at")
      .single();

    if (error) {
      return jsonError("Could not update order.", 500, error.message);
    }

    return Response.json({ order: data });
  }

  const order = demoStore.orders.find((item) => item.id === body.order_id);
  if (!order) {
    return jsonError("Order not found.", 404);
  }

  order.status = body.status as OrderStatus;
  return Response.json({ order });
}
