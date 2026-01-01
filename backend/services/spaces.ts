import { supabase, supabaseAdmin } from "../supabase.ts";

// ===========================================
// 型定義
// ===========================================

export interface SpaceData {
  title: string;
  thumbnail_url?: string;
  description?: string;
  category_id?: string;
  website_url?: string;
  x_url?: string;
  instagram_url?: string;
  external_links?: ExternalLink[];
  is_public?: boolean;
  slug?: string;
}

export interface ExternalLink {
  label: string;
  url: string;
}

export interface Space {
  id: string;
  user_id: string;
  title: string;
  thumbnail_url: string | null;
  description: string | null;
  category_id: string | null;
  website_url: string | null;
  x_url: string | null;
  instagram_url: string | null;
  external_links: ExternalLink[];
  is_public: boolean;
  slug: string | null;
  created_at: string;
  updated_at: string;
  // Subscription status
  subscription_status:
    | "active"
    | "trialing"
    | "past_due"
    | "canceled"
    | "forever_free"
    | null;
  // Joined data
  category?: {
    id: string;
    name: string;
    display_name: string;
  };
  tags?: {
    id: string;
    name: string;
    display_name: string;
  }[];
  owner?: {
    id: string;
    display_name: string;
    avatar_url: string | null;
  };
}

export interface SpaceResult {
  success: boolean;
  space?: Space;
  error?: string;
}

export interface SpacesResult {
  success: boolean;
  spaces?: Space[];
  error?: string;
}

// ===========================================
// スペース CRUD
// ===========================================

/**
 * スペース作成
 */
export const createSpace = async (
  userId: string,
  data: SpaceData
): Promise<SpaceResult> => {
  // slug の重複チェック
  if (data.slug) {
    const { data: existing } = await supabase
      .from("mentor_spaces")
      .select("id")
      .eq("slug", data.slug)
      .single();

    if (existing) {
      return { success: false, error: "この URL は既に使用されています" };
    }
  }

  const { data: space, error } = await supabaseAdmin
    .from("mentor_spaces")
    .insert({
      user_id: userId,
      title: data.title,
      thumbnail_url: data.thumbnail_url,
      description: data.description,
      category_id: data.category_id,
      website_url: data.website_url,
      x_url: data.x_url,
      instagram_url: data.instagram_url,
      external_links: data.external_links || [],
      is_public: data.is_public || false,
      slug: data.slug,
    })
    .select()
    .single();

  if (error) {
    console.error("Create space error:", error);
    return { success: false, error: error.message };
  }

  return { success: true, space };
};

/**
 * スペース取得（ID）
 */
export const getSpace = async (spaceId: string): Promise<SpaceResult> => {
  const { data: space, error } = await supabase
    .from("mentor_spaces")
    .select(
      `
      *,
      category:categories(*),
      space_tags(
        tag:tags(*)
      )
    `
    )
    .eq("id", spaceId)
    .single();

  if (error) {
    return { success: false, error: error.message };
  }

  // タグを平坦化
  const formattedSpace = {
    ...space,
    tags: space.space_tags?.map((st: { tag: unknown }) => st.tag) || [],
    space_tags: undefined,
  };

  return { success: true, space: formattedSpace };
};

/**
 * スペース取得（slug）- 公開ページ用
 * サブスクが有効（active, trialing, forever_free）なスペースのみ公開
 */
export const getSpaceBySlug = async (slug: string): Promise<SpaceResult> => {
  const { data: space, error } = await supabase
    .from("mentor_spaces")
    .select(
      `
      *,
      category:categories(*),
      space_tags(
        tag:tags(*)
      ),
      subscription:subscriptions(status)
    `
    )
    .eq("slug", slug)
    .eq("is_public", true)
    .single();

  if (error) {
    return { success: false, error: "スペースが見つかりません" };
  }

  // サブスク状態を確認
  const subscriptionStatus = space.subscription?.status || null;
  const validStatuses = ["active", "trialing", "forever_free"];

  if (!subscriptionStatus || !validStatuses.includes(subscriptionStatus)) {
    return { success: false, error: "このスペースは現在公開されていません" };
  }

  const formattedSpace = {
    ...space,
    tags: space.space_tags?.map((st: { tag: unknown }) => st.tag) || [],
    space_tags: undefined,
    subscription_status: subscriptionStatus,
    subscription: undefined,
  };

  return { success: true, space: formattedSpace };
};

/**
 * スペース更新
 */
export const updateSpace = async (
  spaceId: string,
  userId: string,
  data: Partial<SpaceData>
): Promise<SpaceResult> => {
  // 所有権チェック
  const { data: existing } = await supabase
    .from("mentor_spaces")
    .select("user_id")
    .eq("id", spaceId)
    .single();

  if (!existing || existing.user_id !== userId) {
    return { success: false, error: "権限がありません" };
  }

  // slug の重複チェック（変更する場合）
  if (data.slug) {
    const { data: slugCheck } = await supabase
      .from("mentor_spaces")
      .select("id")
      .eq("slug", data.slug)
      .neq("id", spaceId)
      .single();

    if (slugCheck) {
      return { success: false, error: "この URL は既に使用されています" };
    }
  }

  const { data: space, error } = await supabaseAdmin
    .from("mentor_spaces")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", spaceId)
    .select()
    .single();

  if (error) {
    console.error("Update space error:", error);
    return { success: false, error: error.message };
  }

  return { success: true, space };
};

/**
 * スペース削除
 */
export const deleteSpace = async (
  spaceId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> => {
  // 所有権チェック
  const { data: existing } = await supabase
    .from("mentor_spaces")
    .select("user_id")
    .eq("id", spaceId)
    .single();

  if (!existing || existing.user_id !== userId) {
    return { success: false, error: "権限がありません" };
  }

  const { error } = await supabaseAdmin
    .from("mentor_spaces")
    .delete()
    .eq("id", spaceId);

  if (error) {
    console.error("Delete space error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
};

/**
 * ユーザーのスペース一覧
 */
export const getUserSpaces = async (userId: string): Promise<SpacesResult> => {
  const { data: spaces, error } = await supabase
    .from("mentor_spaces")
    .select(
      `
      *,
      category:categories(*),
      space_tags(
        tag:tags(*)
      ),
      subscription:subscriptions(status)
    `
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    return { success: false, error: error.message };
  }

  // deno-lint-ignore no-explicit-any
  const formattedSpaces = spaces.map((space: any) => ({
    ...space,
    tags: space.space_tags?.map((st: { tag: unknown }) => st.tag) || [],
    space_tags: undefined,
    subscription_status: space.subscription?.status || null,
    subscription: undefined,
  }));

  return { success: true, spaces: formattedSpaces };
};

/**
 * 公開スペース一覧取得（検索・フィルタリング対応）
 */
export const getPublicSpaces = async (
  options: {
    query?: string;
    categoryId?: string;
    tagId?: string;
    limit?: number;
    offset?: number;
  } = {}
): Promise<SpacesResult> => {
  const { query, categoryId, tagId, limit = 20, offset = 0 } = options;

  let dbQuery = supabase
    .from("mentor_spaces")
    .select(
      `
      *,
      category:categories(*),
      space_tags(
        tag:tags(*)
      )
    `
    )
    .eq("is_public", true)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  // カテゴリフィルタ
  if (categoryId) {
    dbQuery = dbQuery.eq("category_id", categoryId);
  }

  // キーワード検索（タイトルと説明文）
  if (query) {
    dbQuery = dbQuery.or(`title.ilike.%${query}%,description.ilike.%${query}%`);
  }

  const { data: spaces, error } = await dbQuery;

  if (error) {
    return { success: false, error: error.message };
  }

  // deno-lint-ignore no-explicit-any
  let formattedSpaces = spaces.map((space: any) => ({
    ...space,
    tags: space.space_tags?.map((st: { tag: unknown }) => st.tag) || [],
    space_tags: undefined,
  }));

  // タグフィルタ（クライアントサイドでフィルタリング）
  if (tagId) {
    // deno-lint-ignore no-explicit-any
    formattedSpaces = formattedSpaces.filter((space: any) =>
      space.tags?.some((t: { id: string }) => t.id === tagId)
    );
  }

  return { success: true, spaces: formattedSpaces };
};
