import { type NextRequest } from "next/server";
import { z } from "zod";
import { createId, demoStore } from "@/lib/data";
import { getAuthContext } from "@/lib/auth";
import { jsonError, parseBody } from "@/lib/api/response";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const checkoutSchema = z.object({
  customer_email: z.string().email(),
  shipping_name: z.string().min(2),
  shipping_address: z.string().min(8),
  items: z
    .array(
      z.object({
        product_id: z.string().min(1),
        quantity: z.number().int().min(1).max(20)
      })
    )
    .min(1)
});

export async function POST(request: NextRequest) {
  const body = await parseBody(request, checkoutSchema);
  if (body instanceof Response) {
    return body;
  }

  const admin = getSupabaseAdmin();
  const auth = await getAuthContext(request);

  if (admin) {
    const { data: products, error: productError } = await admin
      .from("products")
      .select("id,name,price,currency,stock,is_published")
      .in(
        "id",
        body.items.map((item) => item.product_id)
      )
      .eq("is_published", true);

    if (productError || !products?.length) {
      return jsonError(
        "Could not validate checkout products.",
        422,
        productError?.message
      );
    }

    const productMap = new Map(products.map((product) => [product.id, product]));
    let orderItems: Array<{
      product_id: string;
      name: string;
      quantity: number;
      unit_price: number;
    }>;

    try {
      orderItems = body.items.map((item) => {
        const product = productMap.get(item.product_id);
        if (!product) {
          throw new Error(`Product ${item.product_id} is not available.`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`${product.name} does not have enough stock.`);
        }

        return {
          product_id: product.id,
          name: product.name,
          quantity: item.quantity,
          unit_price: Number(product.price)
        };
      });
    } catch (error) {
      return jsonError(
        error instanceof Error ? error.message : "Checkout validation failed.",
        422
      );
    }

    const total = orderItems.reduce(
      (sum, item) => sum + item.unit_price * item.quantity,
      0
    );
    const orderNumber = `SC-${Date.now().toString().slice(-6)}`;

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_id: auth?.isDemo ? null : auth?.userId ?? null,
        customer_email: body.customer_email,
        shipping_name: body.shipping_name,
        shipping_address: body.shipping_address,
        status: "pending",
        total,
        currency: "AUD",
        channel: "web"
      })
      .select("id,order_number,customer_email,status,total,currency,channel,created_at")
      .single();

    if (orderError || !order) {
      return jsonError("Could not create order.", 500, orderError?.message);
    }

    const { error: itemsError } = await admin.from("order_items").insert(
      orderItems.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        name: item.name,
        quantity: item.quantity,
        unit_price: item.unit_price
      }))
    );

    if (itemsError) {
      return jsonError("Could not create order items.", 500, itemsError.message);
    }

    for (const item of orderItems) {
      await admin.rpc("decrement_product_stock", {
        product_id_input: item.product_id,
        quantity_input: item.quantity
      });
    }

    return Response.json({ order: { ...order, items: orderItems } }, { status: 201 });
  }

  const productMap = new Map(
    demoStore.products.map((product) => [product.id, product])
  );
  let items: Array<{
    product_id: string;
    name: string;
    quantity: number;
    unit_price: number;
  }>;

  try {
    items = body.items.map((item) => {
      const product = productMap.get(item.product_id);
      if (!product || !product.is_published) {
        throw new Error(`Product ${item.product_id} is not available.`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`${product.name} does not have enough stock.`);
      }
      product.stock -= item.quantity;
      return {
        product_id: product.id,
        name: product.name,
        quantity: item.quantity,
        unit_price: product.price
      };
    });
  } catch (error) {
    return jsonError(
      error instanceof Error ? error.message : "Checkout validation failed.",
      422
    );
  }

  const total = items.reduce(
    (sum, item) => sum + item.unit_price * item.quantity,
    0
  );
  const order = {
    id: createId("ord"),
    order_number: `SC-${Math.floor(1000 + Math.random() * 9000)}`,
    customer_email: body.customer_email,
    status: "pending" as const,
    total,
    currency: "AUD",
    channel: "web" as const,
    created_at: new Date().toISOString(),
    items
  };

  demoStore.orders.unshift(order);
  return Response.json({ order }, { status: 201 });
}
