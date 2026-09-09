import "server-only";

import { cookies } from "next/headers";

const ACCESS_COOKIE = "akato_admin_access_token";

export type AdminWorkspaceRole = "owner" | "order_intake" | "card_typing" | "maker" | "delivery";

export type AuthorizedStaff = {
  userId: string;
  email: string | null;
  displayName: string;
  role: AdminWorkspaceRole;
  accessToken: string;
};

type AuthUser = { id: string; email?: string | null };
type StaffRow = { user_id: string; display_name: string; role: AdminWorkspaceRole; active: boolean };

function getConfig() {
  const url = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL)?.replace(/\/$/, "");
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY;

  if (!url || !publishableKey) {
    throw new Error("Supabase Auth is not configured.");
  }

  return { publishableKey, url };
}

export function publicSupabaseHeaders(accessToken?: string): HeadersInit {
  const { publishableKey } = getConfig();
  return {
    apikey: publishableKey,
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
  };
}

export function supabaseUrl(path: string) {
  return `${getConfig().url}${path}`;
}

async function getUser(accessToken: string) {
  const response = await fetch(supabaseUrl("/auth/v1/user"), {
    headers: publicSupabaseHeaders(accessToken),
    cache: "no-store",
  });

  return response.ok ? ((await response.json()) as AuthUser) : null;
}

async function getActiveStaff(userId: string, accessToken: string) {
  const params = new URLSearchParams({
    select: "user_id,display_name,role,active",
    user_id: `eq.${userId}`,
    active: "eq.true",
    limit: "1",
  });
  const response = await fetch(supabaseUrl(`/rest/v1/admin_workspace_staff?${params}`), {
    headers: publicSupabaseHeaders(accessToken),
    cache: "no-store",
  });

  if (!response.ok) return null;
  const rows = (await response.json()) as StaffRow[];
  return rows[0] ?? null;
}

export async function getAuthorizedStaff(): Promise<AuthorizedStaff | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(ACCESS_COOKIE)?.value;
  if (!accessToken) return null;

  const user = await getUser(accessToken);
  if (!user) return null;
  const staff = await getActiveStaff(user.id, accessToken);
  if (!staff) return null;

  return {
    userId: user.id,
    email: user.email ?? null,
    displayName: staff.display_name,
    role: staff.role,
    accessToken,
  };
}

export async function signInWithPassword(email: string, password: string) {
  const response = await fetch(supabaseUrl("/auth/v1/token?grant_type=password"), {
    method: "POST",
    headers: { ...publicSupabaseHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });

  if (!response.ok) return null;
  const session = (await response.json()) as {
    access_token: string;
    expires_in: number;
    user: AuthUser;
  };
  const staff = await getActiveStaff(session.user.id, session.access_token);
  if (!staff) return null;

  const cookieStore = await cookies();
  const secure = process.env.NODE_ENV === "production";
  cookieStore.set(ACCESS_COOKIE, session.access_token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: Math.max(60, session.expires_in - 30),
  });
  return staff;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(ACCESS_COOKIE);
}
