-- 1. Create tables
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  name text,
  avatar_url text,
  company_name text,
  industry text,
  startup_stage text,
  website text,
  preferred_language text default 'en',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id text not null default 'free',
  status text not null default 'active',
  reviews_used integer not null default 0,
  reviews_limit integer not null default 1,
  current_period_start timestamptz not null default now(),
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id),
  constraint subscriptions_plan_id_check check (plan_id in ('free', 'pro', 'investor')),
  constraint subscriptions_status_check check (status in ('active', 'canceled', 'past_due'))
);

create table if not exists public.deck_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_name text not null,
  startup_name text,
  industry text,
  stage text,
  target_raise text,
  target_investors text,
  user_comment text,
  status text not null default 'draft',
  overall_score integer,
  grade text,
  summary text,
  strengths jsonb not null default '[]'::jsonb,
  weaknesses jsonb not null default '[]'::jsonb,
  missing_signals jsonb not null default '[]'::jsonb,
  investor_questions jsonb not null default '[]'::jsonb,
  slide_feedback jsonb not null default '[]'::jsonb,
  raw_ai_response jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint deck_reviews_status_check check (status in ('draft', 'uploading', 'extracting', 'analyzing', 'completed', 'failed')),
  constraint deck_reviews_grade_check check (grade is null or grade in ('A', 'B', 'C', 'D', 'F'))
);

create table if not exists public.review_messages (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references public.deck_reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null,
  content text not null,
  created_at timestamptz not null default now(),
  constraint review_messages_role_check check (role in ('user', 'assistant', 'system'))
);

-- 2. Updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_subscriptions_updated_at on public.subscriptions;
create trigger set_subscriptions_updated_at
before update on public.subscriptions
for each row execute function public.set_updated_at();

drop trigger if exists set_deck_reviews_updated_at on public.deck_reviews;
create trigger set_deck_reviews_updated_at
before update on public.deck_reviews
for each row execute function public.set_updated_at();

-- 3. Auto-create profile and subscription trigger
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', '')
  )
  on conflict (id) do nothing;

  insert into public.subscriptions (
    user_id,
    plan_id,
    status,
    reviews_used,
    reviews_limit
  )
  values (
    new.id,
    'free',
    'active',
    0,
    1
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- 4. Enable Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.subscriptions enable row level security;
alter table public.deck_reviews enable row level security;
alter table public.review_messages enable row level security;

-- 5. Define RLS Policies
drop policy if exists "Users can view own profile" on public.profiles;
create policy "Users can view own profile"
on public.profiles
for select
using (auth.uid() = id);

drop policy if exists "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
on public.profiles
for update
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Users can view own subscription" on public.subscriptions;
create policy "Users can view own subscription"
on public.subscriptions
for select
using (auth.uid() = user_id);

drop policy if exists "Users can update own subscription in MVP" on public.subscriptions;
create policy "Users can update own subscription in MVP"
on public.subscriptions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can view own deck reviews" on public.deck_reviews;
create policy "Users can view own deck reviews"
on public.deck_reviews
for select
using (auth.uid() = user_id);

drop policy if exists "Users can create own deck reviews" on public.deck_reviews;
create policy "Users can create own deck reviews"
on public.deck_reviews
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can update own deck reviews" on public.deck_reviews;
create policy "Users can update own deck reviews"
on public.deck_reviews
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own deck reviews" on public.deck_reviews;
create policy "Users can delete own deck reviews"
on public.deck_reviews
for delete
using (auth.uid() = user_id);

drop policy if exists "Users can view own review messages" on public.review_messages;
create policy "Users can view own review messages"
on public.review_messages
for select
using (auth.uid() = user_id);

drop policy if exists "Users can create own review messages" on public.review_messages;
create policy "Users can create own review messages"
on public.review_messages
for insert
with check (auth.uid() = user_id);

drop policy if exists "Users can delete own review messages" on public.review_messages;
create policy "Users can delete own review messages"
on public.review_messages
for delete
using (auth.uid() = user_id);
