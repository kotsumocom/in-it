-- ==============================================
-- in-it メンタープラットフォーム MVP スキーマ
-- ==============================================
-- 手数料ゼロ・月額1,000円のメンターマーケットプレイス

-- ==============================================
-- 1. カテゴリマスタ
-- ==============================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,        -- 'programming', 'language', 'music', etc.
  display_name TEXT NOT NULL,       -- 'プログラミング', '語学', '音楽'
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 初期カテゴリ
INSERT INTO public.categories (name, display_name, display_order) VALUES
  ('programming', 'プログラミング', 1),
  ('language', '語学', 2),
  ('business', 'ビジネス', 3),
  ('creative', 'クリエイティブ', 4),
  ('music', '音楽', 5),
  ('other', 'その他', 99);

-- ==============================================
-- 2. メンタープロフィール
-- ==============================================
CREATE TABLE public.mentor_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 基本情報
  display_name TEXT NOT NULL,
  tagline TEXT,                      -- 短いキャッチコピー
  bio TEXT,                          -- 自己紹介（Markdown対応）
  avatar_url TEXT,                   -- アイコン画像URL
  
  -- カテゴリ・タグ
  category_id UUID REFERENCES public.categories(id),
  tags TEXT[],                       -- 自由タグ配列 ['Python', 'Web開発', '初心者歓迎']
  
  -- 外部リンク
  external_links JSONB DEFAULT '[]', -- [{type: 'calendly', url: '...', label: '予約する'}, ...]
  
  -- 公開設定
  is_public BOOLEAN DEFAULT false,   -- プロフィール公開フラグ
  slug TEXT UNIQUE,                  -- 公開URL用スラッグ /mentors/{slug}
  
  -- 本人確認（Phase 2）
  verification_status TEXT DEFAULT 'unverified' 
    CHECK (verification_status IN ('unverified', 'email_verified', 'identity_verified', 'pro')),
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- slugのインデックス（高速検索用）
CREATE INDEX idx_mentor_profiles_slug ON public.mentor_profiles(slug) WHERE slug IS NOT NULL;

-- 公開プロフィール検索用インデックス
CREATE INDEX idx_mentor_profiles_public ON public.mentor_profiles(is_public, category_id) WHERE is_public = true;

-- ==============================================
-- 3. サブスクリプション管理
-- ==============================================
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Stripe情報
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  
  -- 状態
  status TEXT NOT NULL DEFAULT 'inactive'
    CHECK (status IN ('active', 'past_due', 'canceled', 'trialing', 'inactive')),
  
  -- 期間
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Stripe IDでの検索用
CREATE INDEX idx_subscriptions_stripe ON public.subscriptions(stripe_customer_id);

-- ==============================================
-- 4. 招待コード
-- ==============================================
CREATE TABLE public.invitation_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 招待者
  inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- コード
  code TEXT NOT NULL UNIQUE,         -- 'TANAKA2025' など
  
  -- Stripe Promotion Code ID
  stripe_promotion_code_id TEXT,
  
  -- 使用状況
  max_uses INTEGER DEFAULT 100,      -- 最大使用回数
  use_count INTEGER DEFAULT 0,       -- 現在の使用回数
  
  -- 有効期間
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_invitation_codes_code ON public.invitation_codes(code);

-- ==============================================
-- 5. 招待履歴
-- ==============================================
CREATE TABLE public.invitation_uses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  invitation_code_id UUID NOT NULL REFERENCES public.invitation_codes(id),
  invitee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 報酬付与状況
  inviter_rewarded BOOLEAN DEFAULT false,  -- 招待者への無料月付与済みか
  inviter_rewarded_at TIMESTAMPTZ,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT now(),
  
  UNIQUE(invitation_code_id, invitee_id)
);

-- ==============================================
-- 6. レビュー（Phase 2、開示請求対応済み）
-- ==============================================
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 対象
  mentor_id UUID NOT NULL REFERENCES public.mentor_profiles(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- 内容
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  content TEXT,
  
  -- 開示請求用メタデータ（管理者のみ閲覧可）
  reviewer_email TEXT NOT NULL,
  ip_address INET NOT NULL,
  user_agent TEXT,
  
  -- 同意フラグ
  agreed_to_reuse BOOLEAN DEFAULT false,  -- 二次利用同意
  
  -- ステータス
  is_visible BOOLEAN DEFAULT true,
  is_deleted BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  
  -- メタ
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reviews_mentor ON public.reviews(mentor_id) WHERE is_visible = true AND is_deleted = false;

-- ==============================================
-- RLS (Row Level Security) ポリシー
-- ==============================================

-- カテゴリ: 誰でも閲覧可
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (true);

-- メンタープロフィール
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.mentor_profiles FOR SELECT 
  USING (is_public = true);

CREATE POLICY "Users can view own profile" 
  ON public.mentor_profiles FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
  ON public.mentor_profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON public.mentor_profiles FOR UPDATE 
  USING (auth.uid() = id);

-- サブスクリプション
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscription" 
  ON public.subscriptions FOR SELECT 
  USING (auth.uid() = user_id);

-- Service Role経由でのみ更新可能（Webhook用）
-- INSERT/UPDATEポリシーは設定しない（バックエンドのみ）

-- 招待コード
ALTER TABLE public.invitation_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own invitation codes" 
  ON public.invitation_codes FOR SELECT 
  USING (auth.uid() = inviter_id);

CREATE POLICY "Users can create own invitation codes" 
  ON public.invitation_codes FOR INSERT 
  WITH CHECK (auth.uid() = inviter_id);

-- 招待履歴
ALTER TABLE public.invitation_uses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view invitations they sent or received" 
  ON public.invitation_uses FOR SELECT 
  USING (
    auth.uid() = invitee_id OR 
    auth.uid() IN (SELECT inviter_id FROM public.invitation_codes WHERE id = invitation_code_id)
  );

-- レビュー
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Visible reviews are viewable by everyone" 
  ON public.reviews FOR SELECT 
  USING (is_visible = true AND is_deleted = false);

CREATE POLICY "Authenticated users can create reviews" 
  ON public.reviews FOR INSERT 
  WITH CHECK (auth.uid() = reviewer_id);

-- ==============================================
-- トリガー: updated_at 自動更新
-- ==============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_mentor_profiles_updated_at
  BEFORE UPDATE ON public.mentor_profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at
  BEFORE UPDATE ON public.subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at
  BEFORE UPDATE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==============================================
-- トリガー: 新規ユーザー登録時にプロフィール作成
-- ==============================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.mentor_profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'New Mentor'));
  
  INSERT INTO public.subscriptions (user_id, status)
  VALUES (NEW.id, 'inactive');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
