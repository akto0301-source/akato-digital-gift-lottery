import { NextResponse } from "next/server";
import { getAuthorizedStaff, publicSupabaseHeaders, supabaseUrl } from "@/lib/supabase/admin-auth";

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const uploadRoles = new Set(["owner", "order_intake", "maker"]);

function safeExtension(file: File) {
  return file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
}

export async function POST(request: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const staff = await getAuthorizedStaff();
  if (!staff) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!uploadRoles.has(staff.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { orderId } = await params;
  const form = await request.formData();
  const file = form.get("file");
  const category = String(form.get("category") ?? "internal");
  const itemId = String(form.get("itemId") ?? "");
  if (!(file instanceof File) || !allowedTypes.has(file.type) || file.size === 0 || file.size > 5 * 1024 * 1024) {
    return NextResponse.json({ error: "Invalid test image" }, { status: 400 });
  }
  if (!new Set(["reference", "finished", "card", "delivery", "internal"]).has(category)) {
    return NextResponse.json({ error: "Invalid category" }, { status: 400 });
  }

  const orderCheck = new URLSearchParams({ select: "id", id: `eq.${orderId}`, limit: "1" });
  const orderResponse = await fetch(supabaseUrl(`/rest/v1/admin_work_orders?${orderCheck}`), {
    headers: publicSupabaseHeaders(staff.accessToken), cache: "no-store",
  });
  if (!orderResponse.ok || ((await orderResponse.json()) as unknown[]).length !== 1) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (itemId) {
    const itemCheck = new URLSearchParams({ select: "id", id: `eq.${itemId}`, order_id: `eq.${orderId}`, limit: "1" });
    const itemResponse = await fetch(supabaseUrl(`/rest/v1/admin_work_order_items?${itemCheck}`), {
      headers: publicSupabaseHeaders(staff.accessToken), cache: "no-store",
    });
    if (!itemResponse.ok || ((await itemResponse.json()) as unknown[]).length !== 1) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
  }

  const objectPath = `${orderId}/${staff.userId}/${crypto.randomUUID()}.${safeExtension(file)}`;
  const storageResponse = await fetch(supabaseUrl(`/storage/v1/object/admin-workspace-private/${objectPath}`), {
    method: "POST",
    headers: { ...publicSupabaseHeaders(staff.accessToken), "Content-Type": file.type, "x-upsert": "false" },
    body: file,
    cache: "no-store",
  });
  if (!storageResponse.ok) return NextResponse.json({ error: "Private upload failed" }, { status: storageResponse.status });

  const metadataResponse = await fetch(supabaseUrl("/rest/v1/admin_work_order_photos?select=id,storage_path,customer_visible"), {
    method: "POST",
    headers: { ...publicSupabaseHeaders(staff.accessToken), "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({ order_id: orderId, item_id: itemId || null, category, storage_path: objectPath, uploaded_by: staff.userId }),
    cache: "no-store",
  });
  if (!metadataResponse.ok) {
    await fetch(supabaseUrl(`/storage/v1/object/admin-workspace-private/${objectPath}`), {
      method: "DELETE", headers: publicSupabaseHeaders(staff.accessToken), cache: "no-store",
    });
    return NextResponse.json({ error: "Photo metadata failed" }, { status: metadataResponse.status });
  }

  return NextResponse.json(((await metadataResponse.json()) as unknown[])[0], { status: 201 });
}
