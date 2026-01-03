import { supabase } from "../supabase.ts";

export interface AuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
  };
  session?: {
    access_token: string;
    refresh_token: string;
  };
  error?: string;
}

export interface MentorProfile {
  id: string;
  display_name: string;
  avatar_url: string | null;
  is_admin: boolean;
  referral_code: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  mentor_profile: MentorProfile | null;
  subscription_status: string | null;
  is_admin: boolean;
}

/**
 * メール/パスワードでログイン
 */
export const signIn = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email!,
    },
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    },
  };
};

/**
 * 新規ユーザー登録（メンター用）
 * mentor_profilesとsubscriptionsはトリガーで自動作成される
 */
export const signUp = async (
  email: string,
  password: string,
  displayName: string
): Promise<AuthResult> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: displayName,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user) {
    return { success: false, error: "ユーザーの作成に失敗しました" };
  }

  return {
    success: true,
    user: {
      id: data.user.id,
      email: data.user.email!,
    },
    session: data.session
      ? {
          access_token: data.session.access_token,
          refresh_token: data.session.refresh_token,
        }
      : undefined,
  };
};

/**
 * ログアウト
 */
export const signOut = async (): Promise<{
  success: boolean;
  error?: string;
}> => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
};

/**
 * アクセストークンからユーザー情報を取得（メンター用）
 */
export const getUser = async (
  accessToken: string
): Promise<{ user: UserProfile | null; error?: string }> => {
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return { user: null, error: error?.message };
  }

  // メンタープロフィールを取得
  const { data: profile } = await supabase
    .from("mentor_profiles")
    .select("*")
    .eq("id", data.user.id)
    .single();

  // サブスク状態を取得
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", data.user.id)
    .single();

  return {
    user: {
      id: data.user.id,
      email: data.user.email!,
      mentor_profile: profile
        ? {
            id: profile.id,
            display_name: profile.display_name,
            avatar_url: profile.avatar_url,
            is_admin: profile.is_admin || false,
            referral_code: profile.referral_code || null,
          }
        : null,
      subscription_status: subscription?.status || null,
      is_admin: profile?.is_admin || false,
    },
  };
};
