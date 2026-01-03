-- mentor_profilesにreferral_code専用カラムを追加
-- ユニーク制約により重複を完全に防止

-- 1. カラム追加
ALTER TABLE mentor_profiles 
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE;

-- 2. 既存ユーザーにreferral_codeを生成（8文字のランダム英数字）
UPDATE mentor_profiles 
SET referral_code = UPPER(SUBSTR(MD5(RANDOM()::TEXT || id::TEXT), 1, 8))
WHERE referral_code IS NULL;

-- 3. NOT NULL制約を追加（新規ユーザーは必須）
-- ALTER TABLE mentor_profiles ALTER COLUMN referral_code SET NOT NULL;

-- 4. 新規ユーザー作成時に自動生成するトリガー
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TRIGGER AS $$
DECLARE
  new_code TEXT;
  code_exists BOOLEAN;
BEGIN
  LOOP
    -- 8文字のランダム英数字を生成
    new_code := UPPER(SUBSTR(MD5(RANDOM()::TEXT || NEW.id::TEXT || NOW()::TEXT), 1, 8));
    
    -- 既存コードと重複しないか確認
    SELECT EXISTS(SELECT 1 FROM mentor_profiles WHERE referral_code = new_code) INTO code_exists;
    
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  NEW.referral_code := new_code;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. トリガー作成
DROP TRIGGER IF EXISTS set_referral_code ON mentor_profiles;
CREATE TRIGGER set_referral_code
  BEFORE INSERT ON mentor_profiles
  FOR EACH ROW
  WHEN (NEW.referral_code IS NULL)
  EXECUTE FUNCTION generate_referral_code();

-- 6. インデックス追加
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_referral_code ON mentor_profiles(referral_code);
