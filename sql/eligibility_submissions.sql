create table if not exists public.eligibility_submissions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  intent text not null,
  hours text not null,
  experience text not null,
  consistency text not null,
  mindset text not null,
  score integer not null default 0,
  status text not null
);

alter table public.eligibility_submissions enable row level security;

create policy "Allow anonymous inserts for eligibility submissions"
on public.eligibility_submissions
for insert
to anon
with check (true);
