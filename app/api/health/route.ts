import { hasSupabaseServerConfig } from "@/lib/supabase/admin";
import { isDemoAuthEnabled } from "@/lib/auth";

export function GET() {
  return Response.json({
    ok: true,
    service: "sebby-commerce",
    supabaseConfigured: hasSupabaseServerConfig(),
    demoAuthEnabled: isDemoAuthEnabled()
  });
}
