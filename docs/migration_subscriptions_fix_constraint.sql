-- subscriptionsテーブルの制約変更
-- 1ユーザーが複数スペースを持てるようにする

-- 1. user_idのUNIQUE制約を削除
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_unique;
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_user_id_key;

-- 2. space_idにUNIQUE制約を追加（upsert用）
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS subscriptions_space_id_key;
ALTER TABLE subscriptions ADD CONSTRAINT subscriptions_space_id_key UNIQUE (space_id);
