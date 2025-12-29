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

export interface UserProfile {
  id: string;
  nickname: string | null;
  grade_level: string | null;
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
 * 新規ユーザー登録 + プロフィール作成
 */
export const signUp = async (
  email: string,
  password: string,
  nickname: string
): Promise<AuthResult> => {
  // 1. Supabase Auth でユーザー作成
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  if (!data.user) {
    return { success: false, error: "ユーザーの作成に失敗しました" };
  }

  // 2. プロフィールを作成
  const { error: profileError } = await supabase.from("profiles").insert({
    id: data.user.id,
    nickname,
  });

  if (profileError) {
    console.error("Profile creation error:", profileError);
    // プロフィール作成に失敗してもユーザーは作成されているので続行
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
 * アクセストークンからユーザー情報を取得
 */
export const getUser = async (
  accessToken: string
): Promise<{ user: UserProfile | null; error?: string }> => {
  const { data, error } = await supabase.auth.getUser(accessToken);

  if (error || !data.user) {
    return { user: null, error: error?.message };
  }

  // プロフィール情報を取得
  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname, grade_level")
    .eq("id", data.user.id)
    .single();

  return {
    user: {
      id: data.user.id,
      nickname: profile?.nickname || null,
      grade_level: profile?.grade_level || null,
    },
  };
};
