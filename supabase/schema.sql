-- AnimalDex Supabase schema
-- Run this in Supabase Dashboard > SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.collections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  image_path text not null,
  image_url text,
  predicted_class text not null,
  display_name text not null,
  confidence numeric(6,5) not null check (confidence >= 0 and confidence <= 1),
  top_predictions jsonb not null default '[]'::jsonb,
  species_info jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists collections_user_created_at_idx
  on public.collections (user_id, created_at desc);

create index if not exists collections_predicted_class_idx
  on public.collections (predicted_class);

alter table public.collections enable row level security;

drop policy if exists "Users can read their own collections" on public.collections;
create policy "Users can read their own collections"
  on public.collections
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert their own collections" on public.collections;
create policy "Users can insert their own collections"
  on public.collections
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update their own collections" on public.collections;
create policy "Users can update their own collections"
  on public.collections
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete their own collections" on public.collections;
create policy "Users can delete their own collections"
  on public.collections
  for delete
  to authenticated
  using (auth.uid() = user_id);
