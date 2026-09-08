"use server";

import { redirect } from "next/navigation";
import { clearAdminSession, signInWithPassword } from "@/lib/supabase/admin-auth";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password || !(await signInWithPassword(email, password))) {
    redirect("/admin/login?error=denied");
  }

  redirect("/admin/orders");
}

export async function logout() {
  await clearAdminSession();
  redirect("/admin/login");
}
