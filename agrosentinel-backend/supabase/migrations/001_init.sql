create extension if not exists postgis;

create table farms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users,
  name text,
  crop_type text,
  polygon geometry(Polygon, 4326),
  country text,
  created_at timestamptz default now()
);

create table alerts (
  id uuid primary key default gen_random_uuid(),
  farm_id uuid references farms(id),
  severity text check (severity in ('low','medium','high','critical')),
  disease_detected text,
  ndvi_score float,
  evi_score float,
  confidence float,
  recommendation text,
  satellite_image_url text,
  analyzed_at timestamptz default now()
);

create table users (
  id uuid primary key references auth.users,
  full_name text,
  phone text,
  country text,
  language text default 'en',
  notification_method text default 'sms'
);
