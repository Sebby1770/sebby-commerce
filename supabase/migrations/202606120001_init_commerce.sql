create schema if not exists app_private;

do $$
begin
  create type public.app_role as enum (
    'customer',
    'support',
    'inventory_manager',
    'operations_manager',
    'admin'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.order_status as enum (
    'pending',
    'paid',
    'packing',
    'fulfilled',
    'cancelled'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text not null default '',
  role public.app_role not null default 'customer',
  status text not null default 'active' check (status in ('active', 'invited', 'suspended')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  name text not null,
  slug text not null unique,
  category text not null,
  description text not null,
  price numeric(12, 2) not null check (price >= 0),
  currency text not null default 'AUD',
  stock integer not null default 0 check (stock >= 0),
  low_stock_threshold integer not null default 10 check (low_stock_threshold >= 0),
  image_url text not null,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_id uuid references auth.users(id) on delete set null,
  customer_email text not null,
  shipping_name text not null default '',
  shipping_address text not null default '',
  status public.order_status not null default 'pending',
  total numeric(12, 2) not null check (total >= 0),
  currency text not null default 'AUD',
  channel text not null default 'web' check (channel in ('web', 'phone', 'wholesale')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id text references public.products(id) on delete set null,
  name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(12, 2) not null check (unit_price >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.inventory_events (
  id uuid primary key default gen_random_uuid(),
  product_id text not null references public.products(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  delta integer not null,
  reason text not null,
  created_at timestamptz not null default now()
);

create or replace function app_private.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function app_private.current_user_role()
returns public.app_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      select role
      from public.profiles
      where id = auth.uid()
        and status = 'active'
    ),
    'customer'::public.app_role
  );
$$;

create or replace function app_private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name, role, status)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'customer',
    'active'
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

create or replace function public.decrement_product_stock(
  product_id_input text,
  quantity_input integer
)
returns void
language plpgsql
set search_path = public
as $$
begin
  update public.products
  set stock = stock - quantity_input
  where id = product_id_input
    and stock >= quantity_input;

  if not found then
    raise exception 'insufficient stock for product %', product_id_input;
  end if;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function app_private.handle_new_user();

drop trigger if exists touch_profiles_updated_at on public.profiles;
create trigger touch_profiles_updated_at
  before update on public.profiles
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_products_updated_at on public.products;
create trigger touch_products_updated_at
  before update on public.products
  for each row execute function app_private.touch_updated_at();

drop trigger if exists touch_orders_updated_at on public.orders;
create trigger touch_orders_updated_at
  before update on public.orders
  for each row execute function app_private.touch_updated_at();

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.inventory_events enable row level security;

drop policy if exists "Profiles are visible to self or admins" on public.profiles;
create policy "Profiles are visible to self or admins"
on public.profiles for select
to authenticated
using (
  id = auth.uid()
  or app_private.current_user_role() = 'admin'
);

drop policy if exists "Published products are public" on public.products;
create policy "Published products are public"
on public.products for select
to anon, authenticated
using (is_published = true);

drop policy if exists "Staff can read all products" on public.products;
create policy "Staff can read all products"
on public.products for select
to authenticated
using (
  app_private.current_user_role() in (
    'support',
    'inventory_manager',
    'operations_manager',
    'admin'
  )
);

drop policy if exists "Inventory staff can manage products" on public.products;
create policy "Inventory staff can manage products"
on public.products for all
to authenticated
using (
  app_private.current_user_role() in (
    'inventory_manager',
    'operations_manager',
    'admin'
  )
)
with check (
  app_private.current_user_role() in (
    'inventory_manager',
    'operations_manager',
    'admin'
  )
);

drop policy if exists "Customers can read own orders" on public.orders;
create policy "Customers can read own orders"
on public.orders for select
to authenticated
using (customer_id = auth.uid());

drop policy if exists "Staff can read all orders" on public.orders;
create policy "Staff can read all orders"
on public.orders for select
to authenticated
using (
  app_private.current_user_role() in (
    'support',
    'operations_manager',
    'admin'
  )
);

drop policy if exists "Customers can create own orders" on public.orders;
create policy "Customers can create own orders"
on public.orders for insert
to authenticated
with check (customer_id = auth.uid());

drop policy if exists "Staff can update order status" on public.orders;
create policy "Staff can update order status"
on public.orders for update
to authenticated
using (
  app_private.current_user_role() in (
    'support',
    'operations_manager',
    'admin'
  )
)
with check (
  app_private.current_user_role() in (
    'support',
    'operations_manager',
    'admin'
  )
);

drop policy if exists "Customers can read own order items" on public.order_items;
create policy "Customers can read own order items"
on public.order_items for select
to authenticated
using (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.customer_id = auth.uid()
  )
);

drop policy if exists "Staff can read all order items" on public.order_items;
create policy "Staff can read all order items"
on public.order_items for select
to authenticated
using (
  app_private.current_user_role() in (
    'support',
    'operations_manager',
    'admin'
  )
);

drop policy if exists "Customers can create items for own orders" on public.order_items;
create policy "Customers can create items for own orders"
on public.order_items for insert
to authenticated
with check (
  exists (
    select 1
    from public.orders
    where orders.id = order_items.order_id
      and orders.customer_id = auth.uid()
  )
);

drop policy if exists "Inventory staff can read inventory events" on public.inventory_events;
create policy "Inventory staff can read inventory events"
on public.inventory_events for select
to authenticated
using (
  app_private.current_user_role() in (
    'inventory_manager',
    'operations_manager',
    'admin'
  )
);

drop policy if exists "Inventory staff can create inventory events" on public.inventory_events;
create policy "Inventory staff can create inventory events"
on public.inventory_events for insert
to authenticated
with check (
  app_private.current_user_role() in (
    'inventory_manager',
    'operations_manager',
    'admin'
  )
);

revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant usage on schema app_private to authenticated;

grant select on table public.products to anon, authenticated;
grant select on table public.profiles to authenticated;
grant select, insert, update on table public.products to authenticated;
grant select, insert, update on table public.orders to authenticated;
grant select, insert on table public.order_items to authenticated;
grant select, insert on table public.inventory_events to authenticated;

grant execute on function app_private.current_user_role() to authenticated;

grant all on all tables in schema public to service_role;
grant all on all functions in schema public to service_role;

alter default privileges for role postgres in schema public
  revoke select, insert, update, delete on tables from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke execute on functions from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke usage, select on sequences from anon, authenticated, service_role;
alter default privileges for role postgres in schema public
  revoke execute on functions from public;

insert into public.products (
  id,
  name,
  slug,
  category,
  description,
  price,
  currency,
  stock,
  low_stock_threshold,
  image_url,
  is_published
)
values
  (
    'prod_kin-carry',
    'Kin Carry Tote',
    'kin-carry-tote',
    'Bags',
    'Structured everyday tote with recycled canvas and a padded laptop sleeve.',
    129,
    'AUD',
    42,
    10,
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=900&q=80',
    true
  ),
  (
    'prod-studio-cup',
    'Studio Ceramic Cup',
    'studio-ceramic-cup',
    'Home',
    'Hand-glazed ceramic cup made for slow mornings and desk rituals.',
    38,
    'AUD',
    8,
    12,
    'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?auto=format&fit=crop&w=900&q=80',
    true
  ),
  (
    'prod-field-journal',
    'Field Journal Set',
    'field-journal-set',
    'Stationery',
    'Three lay-flat notebooks with archival paper and numbered pages.',
    46,
    'AUD',
    61,
    15,
    'https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80',
    true
  )
on conflict (id) do nothing;
