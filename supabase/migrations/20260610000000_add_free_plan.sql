-- 1. Drop the check constraint to allow the new 'free' plan ID
alter table public.subscriptions 
  drop constraint if exists subscriptions_plan_id_check;

-- 2. Add the check constraint including 'free'
alter table public.subscriptions 
  add constraint subscriptions_plan_id_check check (plan_id in ('free', 'bootstrapper', 'pre-seed', 'seed', 'series-a'));

-- 3. Update the default value for plan_id column to 'free'
alter table public.subscriptions
  alter column plan_id set default 'free';

-- 4. Update the new user trigger function to initialize the default 'free' subscription with 0 limits
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
    'free',
    'active',
    0,
    0,
    0,
    0
  )
  on conflict (user_id) do nothing;

  return new;
end;
$$;
