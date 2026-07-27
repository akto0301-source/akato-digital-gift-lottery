create table if not exists public.gift_links (
  id text primary key,
  from_name text not null,
  to_name text not null,
  message text not null,
  locale text not null default 'zh' check (locale in ('zh', 'ja')),
  card_id text,
  scene_id text,
  lot_key text,
  lot_snapshot jsonb,
  status text not null default 'active' check (status in ('active', 'disabled')),
  schema_version integer not null default 1,
  created_at timestamptz not null default now(),
  expires_at timestamptz
);

create index if not exists gift_links_status_expires_at_idx
  on public.gift_links (status, expires_at);

create index if not exists gift_links_created_at_idx
  on public.gift_links (created_at desc);

alter table public.gift_links enable row level security;

comment on table public.gift_links is 'Akato persisted short gift links. Access is server-side through the Supabase service role.';
comment on column public.gift_links.id is 'URL-safe public short code with at least 12 characters.';
comment on column public.gift_links.lot_snapshot is 'Immutable flower lot snapshot used to render shared lot letters without depending on later content edits.';
