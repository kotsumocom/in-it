-- 招待コード使用履歴テーブル
-- 招待者への1000円クレジット付与と、被招待者への1ヶ月無料を追跡

CREATE TABLE IF NOT EXISTS invitation_usages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 招待した人（user_idの最初の8文字がreferral_code）
  inviter_user_id UUID NOT NULL,
  
  -- 招待された人
  invitee_user_id UUID NOT NULL,
  invitee_space_id UUID NOT NULL,
  
  -- クレジット付与のステータス
  credit_granted BOOLEAN DEFAULT FALSE,
  credit_amount INTEGER DEFAULT 1000, -- 1000円
  
  -- Stripe Customer ID（クレジット付与用）
  inviter_stripe_customer_id TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- 同じ被招待者が同じ招待コードを複数回使えないようにする
  UNIQUE(inviter_user_id, invitee_user_id)
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_invitation_usages_inviter ON invitation_usages(inviter_user_id);
CREATE INDEX IF NOT EXISTS idx_invitation_usages_invitee ON invitation_usages(invitee_user_id);

-- RLSを有効化
ALTER TABLE invitation_usages ENABLE ROW LEVEL SECURITY;
