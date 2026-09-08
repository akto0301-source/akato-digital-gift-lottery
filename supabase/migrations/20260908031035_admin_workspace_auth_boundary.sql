revoke all on table public.admin_workspace_staff from anon, authenticated;
revoke all on table public.admin_work_orders from anon, authenticated;
revoke all on table public.admin_work_order_access from anon, authenticated;
revoke all on table public.admin_work_order_sources from anon, authenticated;
revoke all on table public.admin_work_order_items from anon, authenticated;
revoke all on table public.admin_work_order_tasks from anon, authenticated;
revoke all on table public.admin_work_order_photos from anon, authenticated;

grant select on table public.admin_workspace_staff to authenticated;
grant select, insert, update, delete on table public.admin_work_orders to authenticated;
grant select on table public.admin_work_order_access to authenticated;
grant select, insert, delete on table public.admin_work_order_sources to authenticated;
grant select, insert, update, delete on table public.admin_work_order_items to authenticated;
grant select, insert, update, delete on table public.admin_work_order_tasks to authenticated;
grant select, insert, update, delete on table public.admin_work_order_photos to authenticated;

create policy "staff can read their active membership"
on public.admin_workspace_staff for select to authenticated
using (active and user_id = (select auth.uid()));

create policy "active staff can read their own order access"
on public.admin_work_order_access for select to authenticated
using (
  user_id = (select auth.uid())
  and exists (
    select 1 from public.admin_workspace_staff s
    where s.user_id = (select auth.uid()) and s.active
  )
);

create schema if not exists private;

create or replace function private.can_access_admin_order(target_order_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select (select auth.uid()) is not null and exists (
    select 1
    from public.admin_work_order_access a
    join public.admin_workspace_staff s on s.user_id = a.user_id
    where a.order_id = target_order_id
      and a.user_id = (select auth.uid())
      and s.active
  );
$$;

revoke all on function private.can_access_admin_order(uuid) from public, anon;
grant usage on schema private to authenticated;
grant execute on function private.can_access_admin_order(uuid) to authenticated;

insert into public.admin_work_order_access (order_id, user_id, granted_by)
select o.id, o.created_by, o.created_by
from public.admin_work_orders o
join public.admin_workspace_staff s on s.user_id = o.created_by and s.active
where o.created_by is not null
on conflict (order_id, user_id) do nothing;

create policy "active staff can read orders"
on public.admin_work_orders for select to authenticated
using ((select private.can_access_admin_order(id)));
create policy "intake staff can create owned orders"
on public.admin_work_orders for insert to authenticated
with check (created_by = (select auth.uid()) and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role in ('owner', 'order_intake')));
create policy "intake staff can update orders"
on public.admin_work_orders for update to authenticated
using (
  (select private.can_access_admin_order(id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role in ('owner', 'order_intake'))
)
with check (
  (select private.can_access_admin_order(id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role in ('owner', 'order_intake'))
);
create policy "owners can delete orders"
on public.admin_work_orders for delete to authenticated
using (
  (select private.can_access_admin_order(id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role = 'owner')
);

create policy "active staff can read sources"
on public.admin_work_order_sources for select to authenticated
using ((select private.can_access_admin_order(order_id)));
create policy "intake staff can append sources"
on public.admin_work_order_sources for insert to authenticated
with check (
  created_by = (select auth.uid())
  and (select private.can_access_admin_order(order_id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role in ('owner', 'order_intake'))
);
create policy "owners can delete sources"
on public.admin_work_order_sources for delete to authenticated
using (
  (select private.can_access_admin_order(order_id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role = 'owner')
);

create policy "active staff can read items"
on public.admin_work_order_items for select to authenticated
using ((select private.can_access_admin_order(order_id)));
create policy "intake staff can create items"
on public.admin_work_order_items for insert to authenticated
with check (
  (select private.can_access_admin_order(order_id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role in ('owner', 'order_intake'))
);
create policy "assigned roles can update items"
on public.admin_work_order_items for update to authenticated
using (
  (select private.can_access_admin_order(order_id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role in ('owner', 'order_intake', 'maker', 'delivery'))
)
with check (
  (select private.can_access_admin_order(order_id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role in ('owner', 'order_intake', 'maker', 'delivery'))
);
create policy "owners can delete items"
on public.admin_work_order_items for delete to authenticated
using (
  (select private.can_access_admin_order(order_id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role = 'owner')
);

create policy "active staff can read tasks"
on public.admin_work_order_tasks for select to authenticated
using ((select private.can_access_admin_order(order_id)));
create policy "intake staff can create tasks"
on public.admin_work_order_tasks for insert to authenticated
with check (
  (select private.can_access_admin_order(order_id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role in ('owner', 'order_intake'))
);
create policy "active staff can update own or unassigned tasks"
on public.admin_work_order_tasks for update to authenticated
using (
  (select private.can_access_admin_order(order_id))
  and (assignee_user_id is null or assignee_user_id = (select auth.uid()) or exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role = 'owner'))
)
with check (
  (select private.can_access_admin_order(order_id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active)
);
create policy "owners can delete tasks"
on public.admin_work_order_tasks for delete to authenticated
using (
  (select private.can_access_admin_order(order_id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role = 'owner')
);

create policy "active staff can read photo metadata"
on public.admin_work_order_photos for select to authenticated
using ((select private.can_access_admin_order(order_id)));
create policy "photo staff can create private metadata"
on public.admin_work_order_photos for insert to authenticated
with check (
  uploaded_by = (select auth.uid()) and customer_visible = false
  and (select private.can_access_admin_order(order_id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role in ('owner', 'order_intake', 'maker'))
  and exists (select 1 from public.admin_work_orders o where o.id = order_id)
  and (item_id is null or exists (select 1 from public.admin_work_order_items i where i.id = item_id and i.order_id = order_id))
);
create policy "owners can update photo metadata"
on public.admin_work_order_photos for update to authenticated
using (
  (select private.can_access_admin_order(order_id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role = 'owner')
)
with check (
  (select private.can_access_admin_order(order_id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role = 'owner')
);
create policy "owners can delete photo metadata"
on public.admin_work_order_photos for delete to authenticated
using (
  (select private.can_access_admin_order(order_id))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role = 'owner')
);

update storage.buckets
set public = false, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp']
where id = 'admin-workspace-private';

create policy "photo staff can upload order objects"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'admin-workspace-private'
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and (select private.can_access_admin_order(((storage.foldername(name))[1])::uuid))
  and (storage.foldername(name))[2] = (select auth.uid())::text
  and exists (select 1 from public.admin_work_orders o where o.id::text = (storage.foldername(name))[1])
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role in ('owner', 'order_intake', 'maker'))
);
create policy "active staff can read registered order objects"
on storage.objects for select to authenticated
using (
  bucket_id = 'admin-workspace-private'
  and exists (
    select 1 from public.admin_work_order_photos p
    where p.storage_path = name
      and (select private.can_access_admin_order(p.order_id))
  )
);
create policy "uploaders and owners can delete order objects"
on storage.objects for delete to authenticated
using (
  bucket_id = 'admin-workspace-private'
  and (storage.foldername(name))[1] ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$'
  and (select private.can_access_admin_order(((storage.foldername(name))[1])::uuid))
  and exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active)
  and ((storage.foldername(name))[2] = (select auth.uid())::text
    or exists (select 1 from public.admin_workspace_staff s where s.user_id = (select auth.uid()) and s.active and s.role = 'owner'))
);
