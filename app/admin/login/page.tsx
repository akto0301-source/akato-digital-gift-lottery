import { redirect } from "next/navigation";
import { getAuthorizedStaff } from "@/lib/supabase/admin-auth";
import { login } from "./actions";

export default async function AdminLoginPage({ searchParams }: { searchParams?: Promise<{ error?: string }> }) {
  if (await getAuthorizedStaff()) redirect("/admin/orders");
  const params = searchParams ? await searchParams : {};

  return (
    <main style={{ maxWidth: 420, margin: "72px auto", padding: 24, fontFamily: "sans-serif" }}>
      <h1>Akato 內部登入</h1>
      <p>僅限已授權的工作人員測試使用。</p>
      {params.error ? <p role="alert">登入失敗或帳號未獲授權。</p> : null}
      <form action={login} style={{ display: "grid", gap: 16 }}>
        <label>電子郵件<input name="email" type="email" autoComplete="email" required style={{ display: "block", width: "100%" }} /></label>
        <label>密碼<input name="password" type="password" autoComplete="current-password" required style={{ display: "block", width: "100%" }} /></label>
        <button type="submit">登入</button>
      </form>
    </main>
  );
}
