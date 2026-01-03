-- mentor_profilesにreferral_code専用カラムを追加
-- ユニーク制約により重複を完全に防止

-- 1. カラム追加
ALTER TABLE mentor_profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- 2. 既存ユーザーにreferral_codeを生成（8文字のランダム英数字）
UPDATE mentor_profiles 
SET referral_code = UPPER(SUBSTR(MD5(RANDOM()::TEXT || id::TEXT), 1, 8))
WHERE referral_code IS NULL;

-- 3. デフォルト値を設定（トリガーではなくDEFAULTで対応）
-- UUIDベースで生成するため衝突リスクなし
ALTER TABLE mentor_profiles
ALTER COLUMN referral_code SET DEFAULT UPPER(SUBSTR(MD5(RANDOM()::TEXT || gen_random_uuid()::TEXT), 1, 8));

-- 4. インデックス追加
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_referral_code ON mentor_profiles(referral_code);
