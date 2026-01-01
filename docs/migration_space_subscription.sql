-- ==============================================
-- スペース単位課金対応 マイグレーション
-- ==============================================
-- このマイグレーションを migration_multi_space.sql の後に実行

-- ==============================================
-- 1. subscriptions テーブルの修正
-- ==============================================

-- UNIQUE(user_id) 制約を削除（1ユーザー = 複数サブスク可能に）
ALTER TABLE public.subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_key;

-- 代わりに space_id の UNIQUE 制約を追加（1スペース = 1サブスク）
ALTER TABLE public.subscriptions 
  ADD CONSTRAINT subscriptions_space_id_key UNIQUE (space_id);

-- forever_free ステータスを追加
ALTER TABLE public.subscriptions 
  DROP CONSTRAINT IF EXISTS subscriptions_status_check;
  
ALTER TABLE public.subscriptions 
  ADD CONSTRAINT subscriptions_status_check 
  CHECK (status IN ('active', 'past_due', 'canceled', 'trialing', 'inactive', 'forever_free'));

-- ==============================================
-- 2. handle_new_user() トリガーの修正
-- ==============================================
-- サブスク自動作成を削除（スペース単位で作成するため）

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- メンタープロフィールのみ作成
  INSERT INTO public.mentor_profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'New Mentor'));
  
  -- サブスクはスペース作成時に個別に作成するため、ここでは作成しない
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==============================================
-- 3. admin_coupons に forever_free タイプ追加
-- ==============================================
ALTER TABLE public.admin_coupons 
  DROP CONSTRAINT IF EXISTS admin_coupons_type_check;
  
ALTER TABLE public.admin_coupons 
  ADD CONSTRAINT admin_coupons_type_check 
  CHECK (type IN ('year_free', 'forever_free', 'custom'));

-- ==============================================
-- 4. 既存の不要な subscriptions レコードを削除（空の subscription）
-- ==============================================
-- space_id が NULL のレコードは不要
DELETE FROM public.subscriptions WHERE space_id IS NULL;

-- ==============================================
-- 確認クエリ（コメントアウト状態で実行して確認）
-- ==============================================
-- SELECT table_name, column_name, data_type 
-- FROM information_schema.columns 
-- WHERE table_name = 'subscriptions';

-- SELECT conname, contype, pg_get_constraintdef(oid) 
-- FROM pg_constraint 
-- WHERE conrelid = 'public.subscriptions'::regclass;
