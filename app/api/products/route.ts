import { type NextRequest } from "next/server";
import { z } from "zod";
import { demoStore, createId } from "@/lib/data";
import { isAuthResponse, requireRole } from "@/lib/auth";
import { jsonError, parseBody } from "@/lib/api/response";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const productSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  description: z.string().min(8),
  price: z.number().positive(),
  stock: z.number().int().min(0),
  low_stock_threshold: z.number().int().min(0).default(10),
  image_url: z.string().url(),
  is_published: z.boolean().default(true)
});

export async function GET(request: NextRequest) {
  const admin = getSupabaseAdmin();
  const wantsAdmin = request.nextUrl.searchParams.get("admin") === "true";

  if (admin) {
    if (wantsAdmin) {
      const auth = await requireRole(request, [
        "inventory_manager",
        "operations_manager",
        "admin"
      ]);

      if (isAuthResponse(auth)) {
        return auth;
      }
    }

    const query = admin
      .from("products")
      .select(
        "id,name,slug,category,description,price,currency,stock,low_stock_threshold,image_url,is_published,created_at"
      )
      .order("created_at", { ascending: false });

    if (!wantsAdmin) {
      query.eq("is_published", true);
    }

    const { data, error } = await query;

    if (error) {
      return jsonError("Could not load products.", 500, error.message);
    }

    return Response.json({ products: data });
  }

  const products = wantsAdmin
    ? demoStore.products
    : demoStore.products.filter((product) => product.is_published);

  return Response.json({ products });
}

export async function POST(request: NextRequest) {
  const auth = await requireRole(request, [
    "inventory_manager",
    "operations_manager",
    "admin"
  ]);

  if (isAuthResponse(auth)) {
    return auth;
  }

  const body = await parseBody(request, productSchema);
  if (body instanceof Response) {
    return body;
  }

  const slug = body.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const product = {
    id: createId("prod"),
    slug,
    currency: "AUD",
    created_at: new Date().toISOString(),
    ...body
  };

  const admin = getSupabaseAdmin();

  if (admin) {
    const { data, error } = await admin
      .from("products")
      .insert(product)
      .select()
      .single();

    if (error) {
      return jsonError("Could not create product.", 500, error.message);
    }

    return Response.json({ product: data }, { status: 201 });
  }

  demoStore.products.unshift(product);
  return Response.json({ product }, { status: 201 });
}
