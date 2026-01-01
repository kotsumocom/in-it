import { supabase } from "../supabase.ts";

// ===========================================
// 型定義
// ===========================================

export interface Category {
  id: string;
  name: string;
  display_name: string;
  display_order: number;
}

export interface Tag {
  id: string;
  name: string;
  display_name: string;
  category_id: string | null;
  is_featured: boolean;
  display_order: number;
  usage_count: number;
}

export interface CategoriesResult {
  success: boolean;
  categories?: Category[];
  error?: string;
}

export interface TagsResult {
  success: boolean;
  tags?: Tag[];
  error?: string;
}

// ===========================================
// カテゴリ
// ===========================================

/**
 * カテゴリ一覧取得
 */
export const getCategories = async (): Promise<CategoriesResult> => {
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .order("display_order", { ascending: true });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, categories };
};

// ===========================================
// タグ
// ===========================================

/**
 * タグ一覧取得（カテゴリで絞り込み可能）
 */
export const getTags = async (categoryId?: string): Promise<TagsResult> => {
  let query = supabase
    .from("tags")
    .select("*")
    .order("is_featured", { ascending: false })
    .order("display_order", { ascending: true });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data: tags, error } = await query;

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, tags };
};

/**
 * 注目タグ取得（ランディングページ用）
 */
export const getFeaturedTags = async (): Promise<TagsResult> => {
  const { data: tags, error } = await supabase
    .from("tags")
    .select("*")
    .eq("is_featured", true)
    .order("display_order", { ascending: true })
    .limit(20);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, tags };
};

/**
 * タグ検索
 */
export const searchTags = async (query: string): Promise<TagsResult> => {
  const { data: tags, error } = await supabase
    .from("tags")
    .select("*")
    .ilike("display_name", `%${query}%`)
    .order("usage_count", { ascending: false })
    .limit(20);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, tags };
};

// ===========================================
// スペースタグ管理
// ===========================================

/**
 * スペースにタグを追加
 */
export const addTagsToSpace = async (
  spaceId: string,
  userId: string,
  tagIds: string[]
): Promise<{ success: boolean; error?: string }> => {
  // 所有権チェック
  const { data: space } = await supabase
    .from("mentor_spaces")
    .select("user_id")
    .eq("id", spaceId)
    .single();

  if (!space || space.user_id !== userId) {
    return { success: false, error: "権限がありません" };
  }

  // 既存のタグを削除
  await supabase.from("space_tags").delete().eq("space_id", spaceId);

  // 新しいタグを追加
  if (tagIds.length > 0) {
    const insertData = tagIds.map((tagId) => ({
      space_id: spaceId,
      tag_id: tagId,
    }));

    const { error } = await supabase.from("space_tags").insert(insertData);

    if (error) {
      console.error("Add tags error:", error);
      return { success: false, error: error.message };
    }

    // タグの使用回数を更新
    for (const tagId of tagIds) {
      await supabase.rpc("increment_tag_usage", { tag_id: tagId });
    }
  }

  return { success: true };
};

/**
 * スペースのタグを取得
 */
export const getSpaceTags = async (spaceId: string): Promise<TagsResult> => {
  const { data, error } = await supabase
    .from("space_tags")
    .select(
      `
      tag:tags(*)
    `
    )
    .eq("space_id", spaceId);

  if (error) {
    return { success: false, error: error.message };
  }

  const tags = data.map((item: { tag: Tag }) => item.tag);

  return { success: true, tags };
};

/**
 * スペースからタグを削除
 */
export const removeTagFromSpace = async (
  spaceId: string,
  userId: string,
  tagId: string
): Promise<{ success: boolean; error?: string }> => {
  // 所有権チェック
  const { data: space } = await supabase
    .from("mentor_spaces")
    .select("user_id")
    .eq("id", spaceId)
    .single();

  if (!space || space.user_id !== userId) {
    return { success: false, error: "権限がありません" };
  }

  const { error } = await supabase
    .from("space_tags")
    .delete()
    .eq("space_id", spaceId)
    .eq("tag_id", tagId);

  if (error) {
    console.error("Remove tag error:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
};
