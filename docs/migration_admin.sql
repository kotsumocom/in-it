-- Admin 権限管理用マイグレーション
-- mentor_profiles テーブルに is_admin カラムを追加

ALTER TABLE public.mentor_profiles 
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE;

-- 既存の管理者にフラグを設定（必要に応じてメールアドレスを変更）
-- UPDATE public.mentor_profiles 
-- SET is_admin = TRUE 
-- WHERE id IN (
--   SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com'
-- );
