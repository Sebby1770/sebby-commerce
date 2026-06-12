import type { NextRequest } from "next/server";
import type { Role } from "@/lib/types";
import { getSupabaseAdmin, hasSupabaseServerConfig } from "@/lib/supabase/admin";

export type AuthContext = {
  userId: string;
  email: string;
  role: Role;
  isDemo: boolean;
};

const allRoles: Role[] = [
  "customer",
  "support",
  "inventory_manager",
  "operations_manager",
  "admin"
];

export function isDemoAuthEnabled() {
  if (process.env.NODE_ENV === "production") {
    return process.env.ENABLE_DEMO_AUTH === "true";
  }

  return process.env.ENABLE_DEMO_AUTH === "true" || !hasSupabaseServerConfig();
}

function roleFromHeader(request: NextRequest): Role {
  const role = request.headers.get("x-demo-role") as Role | null;
  return role && allRoles.includes(role) ? role : "customer";
}

function bearerToken(request: NextRequest) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) {
    return null;
  }

  return header.slice("Bearer ".length).trim();
}

export async function getAuthContext(
  request: NextRequest
): Promise<AuthContext | null> {
  const admin = getSupabaseAdmin();
  const token = bearerToken(request);

  if (admin && token) {
    const {
      data: { user },
      error
    } = await admin.auth.getUser(token);

    if (error || !user?.id) {
      return null;
    }

    const { data: profile } = await admin
      .from("profiles")
      .select("email, full_name, role, status")
      .eq("id", user.id)
      .maybeSingle();

    if (profile?.status === "suspended") {
      return null;
    }

    return {
      userId: user.id,
      email: profile?.email ?? user.email ?? "unknown@example.com",
      role: (profile?.role as Role | null) ?? "customer",
      isDemo: false
    };
  }

  if (isDemoAuthEnabled()) {
    const role = roleFromHeader(request);

    return {
      userId: `demo-${role}`,
      email: `${role.replaceAll("_", ".")}@demo.local`,
      role,
      isDemo: true
    };
  }

  return null;
}

export async function requireRole(
  request: NextRequest,
  allowedRoles: Role[]
): Promise<AuthContext | Response> {
  const auth = await getAuthContext(request);

  if (!auth) {
    return Response.json(
      { error: "Authentication required." },
      { status: 401 }
    );
  }

  if (!allowedRoles.includes(auth.role)) {
    return Response.json(
      {
        error: "You do not have permission to perform this action.",
        required_roles: allowedRoles,
        current_role: auth.role
      },
      { status: 403 }
    );
  }

  return auth;
}

export function isAuthResponse(value: AuthContext | Response): value is Response {
  return value instanceof Response;
}
