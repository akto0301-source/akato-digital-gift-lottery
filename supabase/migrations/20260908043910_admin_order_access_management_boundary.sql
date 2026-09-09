grant insert, delete on table public.admin_work_order_access to authenticated;

create policy "active owners can read order access"
on public.admin_work_order_access for select to authenticated
using (
  exists (
    select 1
    from public.admin_workspace_staff s
    where s.user_id = (select auth.uid())
      and s.active
      and s.role = 'owner'
  )
);

create policy "active owners can grant order access"
on public.admin_work_order_access for insert to authenticated
with check (
  granted_by = (select auth.uid())
  and exists (
    select 1
    from public.admin_workspace_staff s
    where s.user_id = (select auth.uid())
      and s.active
      and s.role = 'owner'
  )
);

create policy "active owners can revoke order access"
on public.admin_work_order_access for delete to authenticated
using (
  exists (
    select 1
    from public.admin_workspace_staff s
    where s.user_id = (select auth.uid())
      and s.active
      and s.role = 'owner'
  )
);

comment on policy "active owners can grant order access"
on public.admin_work_order_access is
  'Authenticated callers may grant access only when they are active owners and record themselves as granted_by. Trusted backend roles remain controlled by server-side credentials.';

comment on policy "active owners can read order access"
on public.admin_work_order_access is
  'Active owners may inspect membership rows required to manage grants and revoke them through the Data API.';

comment on policy "active owners can revoke order access"
on public.admin_work_order_access is
  'Authenticated callers may revoke access only while they are active owners. Trusted backend roles remain controlled by server-side credentials.';
