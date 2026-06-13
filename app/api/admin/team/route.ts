import { type NextRequest } from "next/server";
import { z } from "zod";
import { createId, demoStore } from "@/lib/data";
import { isAuthResponse, requireRole } from "@/lib/auth";
import { applyRateLimit } from "@/lib/api/rate-limit";
import { jsonError, parseBody } from "@/lib/api/response";
import { getSupabaseAdmin } from "@/lib/supabase/admin";

const inviteSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(2),
  role: z.enum([
    "support",
    "inventory_manager",
    "operations_manager",
    "admin"
  ])
});

const updateRoleSchema = z.object({
  user_id: z.string().min(1),
  role: z.enum([
    "customer",
    "support",
    "inventory_manager",
    "operations_manager",
    "admin"
  ])
});

export async function GET(request: NextRequest) {
  const rateLimit = applyRateLimit(request, {
    scope: "team:read",
    limit: 40,
    windowMs: 60_000
  });
  if (rateLimit) {
    return rateLimit;
  }

  const auth = await requireRole(request, ["admin"]);
  if (isAuthResponse(auth)) {
    return auth;
  }

  const admin = getSupabaseAdmin();

  if (admin) {
    const { data, error } = await admin
      .from("profiles")
      .select("id,email,full_name,role,status,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      return jsonError("Could not load team.", 500, error.message);
    }

    return Response.json({ team: data });
  }

  return Response.json({ team: demoStore.team });
}

export async function POST(request: NextRequest) {
  const rateLimit = applyRateLimit(request, {
    scope: "team:write",
    limit: 20,
    windowMs: 60_000
  });
  if (rateLimit) {
    return rateLimit;
  }

  const auth = await requireRole(request, ["admin"]);
  if (isAuthResponse(auth)) {
    return auth;
  }

  const body = await parseBody(request, inviteSchema);
  if (body instanceof Response) {
    return body;
  }

  const admin = getSupabaseAdmin();

  if (admin) {
    const { data, error } = await admin.auth.admin.inviteUserByEmail(body.email, {
      data: {
        full_name: body.full_name,
        requested_role: body.role
      }
    });

    if (error || !data.user) {
      return jsonError("Could not invite user.", 500, error?.message);
    }

    await admin.from("profiles").upsert({
      id: data.user.id,
      email: body.email,
      full_name: body.full_name,
      role: body.role,
      status: "invited"
    });

    return Response.json(
      {
        member: {
          id: data.user.id,
          email: body.email,
          full_name: body.full_name,
          role: body.role,
          status: "invited",
          created_at: new Date().toISOString()
        }
      },
      { status: 201 }
    );
  }

  const member = {
    id: createId("usr"),
    email: body.email,
    full_name: body.full_name,
    role: body.role,
    status: "invited" as const,
    created_at: new Date().toISOString()
  };

  demoStore.team.unshift(member);
  return Response.json({ member }, { status: 201 });
}

export async function PATCH(request: NextRequest) {
  const rateLimit = applyRateLimit(request, {
    scope: "team:write",
    limit: 20,
    windowMs: 60_000
  });
  if (rateLimit) {
    return rateLimit;
  }

  const auth = await requireRole(request, ["admin"]);
  if (isAuthResponse(auth)) {
    return auth;
  }

  const body = await parseBody(request, updateRoleSchema);
  if (body instanceof Response) {
    return body;
  }

  const admin = getSupabaseAdmin();

  if (admin) {
    const { data, error } = await admin
      .from("profiles")
      .update({ role: body.role })
      .eq("id", body.user_id)
      .select("id,email,full_name,role,status,created_at")
      .single();

    if (error) {
      return jsonError("Could not update role.", 500, error.message);
    }

    return Response.json({ member: data });
  }

  const member = demoStore.team.find((item) => item.id === body.user_id);
  if (!member) {
    return jsonError("Team member not found.", 404);
  }

  member.role = body.role;
  return Response.json({ member });
}
