import { NextResponse } from "next/server";
import { getAuthorizedStaff, publicSupabaseHeaders, supabaseUrl } from "@/lib/supabase/admin-auth";

type PhotoRow = { storage_path: string };

export async function GET(_request: Request, { params }: { params: Promise<{ orderId: string; photoId: string }> }) {
  const staff = await getAuthorizedStaff();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { orderId, photoId } = await params;
  const query = new URLSearchParams({ select: "storage_path", id: `eq.${photoId}`, order_id: `eq.${orderId}`, limit: "1" });
  const metadata = await fetch(supabaseUrl(`/rest/v1/admin_work_order_photos?${query}`), {
    headers: publicSupabaseHeaders(staff.accessToken), cache: "no-store",
  });
  if (!metadata.ok) return NextResponse.json({ error: "Photo lookup failed" }, { status: metadata.status });
  const photo = ((await metadata.json()) as PhotoRow[])[0];
  if (!photo) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const objectResponse = await fetch(supabaseUrl(`/storage/v1/object/authenticated/admin-workspace-private/${photo.storage_path}`), {
    headers: publicSupabaseHeaders(staff.accessToken), cache: "no-store",
  });
  if (!objectResponse.ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return new NextResponse(objectResponse.body, {
    headers: {
      "Content-Type": objectResponse.headers.get("content-type") ?? "application/octet-stream",
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
