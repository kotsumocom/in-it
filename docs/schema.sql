-- in-it MVP Schema
-- Based on requirements: Zero-Management, Math-only, Map UI, Gist Content

-- 1. Users Profile (Extends Supabase Auth)
-- 認証はSupabase Authを利用。ユーザー属性を管理。
create table public.profiles (
  id uuid references auth.users not null primary key,
  nickname text,
  grade_level text, -- 'elementary', 'junior_high', 'high_school'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Study Units (The Map Database)
-- 数学の単元マスターデータ。IDで依存関係（親子/順序）を持たせることでスキルツリーを表現。
create table public.units (
  id uuid default gen_random_uuid() primary key,
  title text not null, -- 単元名 e.g. "因数分解"
  description text,
  order_index integer not null, -- 表示順
  grade_category text not null, -- 'math_1', 'math_a', etc.
  parent_id uuid references public.units(id), -- 親ノード（階層構造用）
  content_markdown text, -- Gist解説。動画URL埋め込み(Markdown)やテキストを自由に配置可能。
  estimated_duration integer default 10, -- 予習にかかる標準時間(分)
  standard_month integer, -- 標準カリキュラムでの学習月 (1-12)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. User Progress (The Map Status)
-- ユーザーごとの単元「攻略」状況。
create table public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  unit_id uuid references public.units(id) not null,
  status text check (status in ('locked', 'unlocked', 'completed', 'mastered')) default 'locked',
  completed_at timestamp with time zone,
  unique(user_id, unit_id)
);

-- RLS (Row Level Security) Policies
-- 基本的に本人が自分のデータしか見れないようにする
alter table public.profiles enable row level security;
alter table public.user_progress enable row level security;

create policy "Public profiles are viewable by everyone." on public.profiles for select using ( true );
create policy "Users can insert their own profile." on public.profiles for insert with check ( auth.uid() = id );
create policy "Users can update own profile." on public.profiles for update using ( auth.uid() = id );

create policy "Units are viewable by everyone." on public.units for select using ( true );

create policy "Users can view own progress." on public.user_progress for select using ( auth.uid() = user_id );
create policy "Users can insert own progress." on public.user_progress for insert with check ( auth.uid() = user_id );
create policy "Users can update own progress." on public.user_progress for update using ( auth.uid() = user_id );
