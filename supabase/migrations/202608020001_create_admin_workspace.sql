create table if not exists public.admin_workspace_staff (
  user_id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null,
  role text not null check (role in ('owner', 'order_intake', 'card_typing', 'maker', 'delivery')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_work_orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text,
  customer_contact text,
  delivery_date date,
  status text not null default 'draft' check (
    status in ('draft', 'needs_confirmation', 'confirmed', 'in_progress', 'delivering', 'completed', 'cancelled')
  ),
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.admin_work_order_access (
  order_id uuid not null references public.admin_work_orders (id) on delete cascade,
  user_id uuid not null references public.admin_workspace_staff (user_id) on delete cascade,
  granted_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  primary key (order_id, user_id)
);

create table if not exists public.admin_work_order_sources (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.admin_work_orders (id) on delete cascade,
  sequence_number integer not null check (sequence_number > 0),
  source_type text not null check (source_type in ('line_text', 'line_screenshot', 'customer_file', 'phone_note', 'other')),
  source_text text,
  storage_path text,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  unique (order_id, sequence_number),
  check (source_text is not null or storage_path is not null)
);

create table if not exists public.admin_work_order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.admin_work_orders (id) on delete cascade,
  sequence_number integer not null check (sequence_number > 0),
  item_type text not null check (item_type in ('蘭花', '植物', '永生花', '落地花籃', '其他')),
  amount integer not null default 0 check (amount >= 0),
  recipient_name text,
  recipient_title text,
  recipient_organization text,
  card_text text,
  plant_request text,
  reference_focus text,
  must_keep text,
  substitution_policy text not null default '替換前詢問客戶' check (
    substitution_policy in ('由花藝師調整', '替換前詢問客戶', '不可替換')
  ),
  special_requirements text,
  delivery_address text,
  delivery_building text,
  delivery_floor text,
  production_status text not null default 'pending' check (
    production_status in ('pending', 'making', 'completed', 'delivering', 'delivered', 'cancelled')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (order_id, sequence_number)
);

create table if not exists public.admin_work_order_tasks (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.admin_work_orders (id) on delete cascade,
  item_id uuid references public.admin_work_order_items (id) on delete cascade,
  task_type text not null check (task_type in ('card_typing', 'production', 'delivery', 'customer_report')),
  assignee_user_id uuid references auth.users (id),
  assignee_label text,
  status text not null default 'pending' check (status in ('pending', 'in_progress', 'done', 'blocked', 'cancelled')),
  due_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_work_order_photos (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.admin_work_orders (id) on delete cascade,
  item_id uuid references public.admin_work_order_items (id) on delete cascade,
  category text not null check (category in ('reference', 'finished', 'card', 'delivery', 'internal')),
  storage_path text not null unique,
  customer_visible boolean not null default false,
  caption text,
  uploaded_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create index if not exists admin_work_orders_delivery_date_idx
  on public.admin_work_orders (delivery_date, status);

create index if not exists admin_work_order_access_user_idx
  on public.admin_work_order_access (user_id, order_id);

create index if not exists admin_work_order_sources_order_idx
  on public.admin_work_order_sources (order_id, sequence_number);

create index if not exists admin_work_order_items_order_idx
  on public.admin_work_order_items (order_id, sequence_number);

create index if not exists admin_work_order_tasks_assignee_idx
  on public.admin_work_order_tasks (assignee_user_id, status, due_at);

create index if not exists admin_work_order_photos_item_idx
  on public.admin_work_order_photos (item_id, category, created_at);

alter table public.admin_workspace_staff enable row level security;
alter table public.admin_work_orders enable row level security;
alter table public.admin_work_order_access enable row level security;
alter table public.admin_work_order_sources enable row level security;
alter table public.admin_work_order_items enable row level security;
alter table public.admin_work_order_tasks enable row level security;
alter table public.admin_work_order_photos enable row level security;

insert into storage.buckets (id, name, public)
values ('admin-workspace-private', 'admin-workspace-private', false)
on conflict (id) do update set public = excluded.public;

comment on table public.admin_work_orders is
  'Akato internal order lifecycle. No client-side access policy is installed in phase 1.';

comment on table public.admin_work_order_access is
  'Explicit order membership. Staff roles control capabilities; these rows control which orders a staff member may access.';

comment on table public.admin_work_order_sources is
  'Append-only source evidence such as copied LINE text, screenshots, files, and later customer changes.';

comment on table public.admin_work_order_items is
  'One physical work item per row so production, card, delivery, and photos stay attached to the correct gift.';

comment on table public.admin_work_order_photos is
  'Private photo metadata. customer_visible is an explicit review choice and never defaults to true.';

comment on column public.admin_work_order_sources.sequence_number is
  'Preserves the order in which customer instructions and changes were received.';

comment on column public.admin_work_order_photos.customer_visible is
  'Only approved photos may enter a later customer delivery report.';
