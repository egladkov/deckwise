-- 1. Add revisions_used and revisions_limit columns to subscriptions table
alter table public.subscriptions 
  add column if not exists revisions_used integer not null default 0,
  add column if not exists revisions_limit integer not null default 2;

-- 2. Drop the old check constraint to allow new plan IDs
alter table public.subscriptions 
  drop constraint if exists subscriptions_plan_id_check;

-- 3. Update existing data to migrate from old plan IDs to new plan IDs
update public.subscriptions
set plan_id = 'bootstrapper',
    reviews_limit = 1,
    revisions_limit = 2
where plan_id = 'free';

update public.subscriptions
set plan_id = 'pre-seed',
    reviews_limit = 3,
    revisions_limit = 6
where plan_id = 'pro';

update public.subscriptions
set plan_id = 'seed',
    reviews_limit = 8,
    revisions_limit = 15
where plan_id = 'investor';

-- 4. Add the new check constraint for the updated plan IDs
alter table public.subscriptions 
  add constraint subscriptions_plan_id_check check (plan_id in ('bootstrapper', 'pre-seed', 'seed', 'series-a'));

-- 5. Update the default value for plan_id column
alter table public.subscriptions
  alter column plan_id set default 'bootstrapper';

-- 6. Update the new user trigger function to initialize the default 'bootstrapper' subscription
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
    reviews_limit,
    revisions_used,
    revisions_limit
  )
  values (
    new.id,
    'bootstrapper',
    'active',
    0,
    1,
    0,
    2
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;
