import { NextResponse } from "next/server";
import { getAuthorizedStaff, publicSupabaseHeaders, supabaseUrl } from "@/lib/supabase/admin-auth";

export async function GET() {
  const staff = await getAuthorizedStaff();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const response = await fetch(
    supabaseUrl("/rest/v1/admin_work_orders?select=id,order_number,delivery_date,status,created_at&order=created_at.desc&limit=50"),
    { headers: publicSupabaseHeaders(staff.accessToken), cache: "no-store" },
  );
  if (!response.ok) return NextResponse.json({ error: "Private data request failed" }, { status: response.status });
  return NextResponse.json(await response.json(), { headers: { "Cache-Control": "no-store" } });
}
