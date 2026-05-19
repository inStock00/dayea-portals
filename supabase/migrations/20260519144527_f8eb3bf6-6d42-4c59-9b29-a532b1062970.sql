
create extension if not exists pgcrypto;

do $$ begin
  create type public.portal_type as enum ('dreamer', 'partner');
exception when duplicate_object then null; end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  portal portal_type not null,
  full_name text not null,
  agent_id text,
  agency text,
  tier text,
  preferred_villa text,
  total_stays int not null default 0,
  member_since int,
  created_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

create table if not exists public.partner_bookings (
  id uuid primary key default gen_random_uuid(),
  partner_id uuid not null references auth.users(id) on delete cascade,
  client_name text not null,
  villa text not null,
  arrival date not null,
  nights int not null,
  status text not null,
  commission numeric not null,
  created_at timestamptz not null default now()
);
alter table public.partner_bookings enable row level security;
drop policy if exists "partner_bookings_select_own" on public.partner_bookings;
create policy "partner_bookings_select_own" on public.partner_bookings for select using (auth.uid() = partner_id);
drop policy if exists "partner_bookings_modify_own" on public.partner_bookings;
create policy "partner_bookings_modify_own" on public.partner_bookings for all using (auth.uid() = partner_id) with check (auth.uid() = partner_id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, portal, full_name, agent_id, agency, tier, preferred_villa, total_stays, member_since)
  values (
    new.id,
    coalesce((new.raw_user_meta_data->>'portal')::portal_type, 'dreamer'),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'agent_id',
    new.raw_user_meta_data->>'agency',
    new.raw_user_meta_data->>'tier',
    new.raw_user_meta_data->>'preferred_villa',
    coalesce((new.raw_user_meta_data->>'total_stays')::int, 0),
    coalesce((new.raw_user_meta_data->>'member_since')::int, extract(year from now())::int)
  ) on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

do $$
declare
  v_dreamer_id uuid;
  v_partner_id uuid;
begin
  select id into v_dreamer_id from auth.users where email = 'sarah@dayea.demo';
  if v_dreamer_id is null then
    v_dreamer_id := gen_random_uuid();
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000', v_dreamer_id, 'authenticated', 'authenticated',
      'sarah@dayea.demo', crypt('DreamerDemo2025', gen_salt('bf')), now(),
      jsonb_build_object('provider','email','providers', jsonb_build_array('email')),
      jsonb_build_object('portal','dreamer','full_name','Sarah Lindqvist','preferred_villa','Villa 4','total_stays','7','member_since','2019'),
      now(), now(), '', '', '', ''
    );
    insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), v_dreamer_id,
      jsonb_build_object('sub', v_dreamer_id::text, 'email', 'sarah@dayea.demo', 'email_verified', true),
      'email', v_dreamer_id::text, now(), now(), now());
  end if;

  select id into v_partner_id from auth.users where email = 'advisor@dayea.demo';
  if v_partner_id is null then
    v_partner_id := gen_random_uuid();
    insert into auth.users (
      instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) values (
      '00000000-0000-0000-0000-000000000000', v_partner_id, 'authenticated', 'authenticated',
      'advisor@dayea.demo', crypt('PartnerDemo2025', gen_salt('bf')), now(),
      jsonb_build_object('provider','email','providers', jsonb_build_array('email')),
      jsonb_build_object('portal','partner','full_name','Claire Beaumont','agent_id','VL-2274-A','agency','Voyage Lumière','tier','Platinum Atelier'),
      now(), now(), '', '', '', ''
    );
    insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
    values (gen_random_uuid(), v_partner_id,
      jsonb_build_object('sub', v_partner_id::text, 'email', 'advisor@dayea.demo', 'email_verified', true),
      'email', v_partner_id::text, now(), now(), now());
  end if;

  insert into public.partner_bookings (partner_id, client_name, villa, arrival, nights, status, commission)
  select v_partner_id, c.client_name, c.villa, c.arrival::date, c.nights, c.status, c.commission
  from (values
    ('Mr. & Mrs. Aldridge', 'Villa 9', '2026-06-04', 7, 'Confirmed', 4280),
    ('Hartley Family', 'Villa 12 + 13', '2026-07-22', 10, 'Confirmed', 9100),
    ('Ms. Okafor', 'Villa 2', '2026-09-15', 5, 'Hold', 2150),
    ('Dr. Tanaka', 'Villa 7', '2026-10-03', 6, 'Confirmed', 3640),
    ('The Reyes Honeymoon', 'Villa 17', '2026-11-18', 9, 'Awaiting deposit', 5980)
  ) as c(client_name, villa, arrival, nights, status, commission)
  where not exists (
    select 1 from public.partner_bookings b
    where b.partner_id = v_partner_id and b.client_name = c.client_name and b.villa = c.villa
  );
end $$;
