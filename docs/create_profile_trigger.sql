-- Supabase Auth でユーザーが作成されたときに
-- 自動的に profiles テーブルにレコードを作成するトリガー

-- 1. トリガー関数を作成
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, nickname)
  values (new.id, coalesce(new.raw_user_meta_data->>'nickname', new.email));
  return new;
end;
$$ language plpgsql security definer;

-- 2. auth.users テーブルにトリガーを設定
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
