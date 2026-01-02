/**
 * バックエンドAPI呼び出しクライアント
 */

const API_URL = Deno.env.get("API_URL") || "http://localhost:3001";

/**
 * バックエンドAPIにリクエストを送信
 */
async function fetchAPI<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    const url = `${API_URL}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        data: null,
        error: errorData.error || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    return { data, error: null };
  } catch (error) {
    console.error("API request failed:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Stripe Checkoutセッションを作成
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  successUrl: string,
  cancelUrl: string
): Promise<{ url: string | null; error: string | null }> {
  const { data, error } = await fetchAPI<{ url: string }>(
    "/api/stripe/checkout",
    {
      method: "POST",
      body: JSON.stringify({ userId, email, successUrl, cancelUrl }),
    }
  );

  if (error) {
    return { url: null, error };
  }

  return { url: data?.url || null, error: null };
}

/**
 * サブスクリプション状態を取得
 */
export async function getSubscriptionStatus(
  userId: string
): Promise<{ status: string | null; error: string | null }> {
  const { data, error } = await fetchAPI<{ status: string }>(
    `/api/subscriptions/${userId}`
  );

  if (error) {
    return { status: null, error };
  }

  return { status: data?.status || null, error: null };
}

/**
 * ヘルスチェック
 */
export async function checkHealth(): Promise<boolean> {
  const { data } = await fetchAPI<{ status: string }>("/api/health");
  return data?.status === "ok";
}

// ===========================================
// カテゴリ・タグ API
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
}

/**
 * カテゴリ一覧取得
 */
export async function getCategories(): Promise<{
  categories: Category[];
  error: string | null;
}> {
  const { data, error } = await fetchAPI<Category[]>("/api/categories");
  return { categories: data || [], error };
}

/**
 * タグ一覧取得
 */
export async function getTags(
  categoryId?: string
): Promise<{ tags: Tag[]; error: string | null }> {
  const endpoint = categoryId
    ? `/api/tags?category=${categoryId}`
    : "/api/tags";
  const { data, error } = await fetchAPI<Tag[]>(endpoint);
  return { tags: data || [], error };
}

/**
 * タグ検索
 */
export async function searchTags(
  query: string
): Promise<{ tags: Tag[]; error: string | null }> {
  const { data, error } = await fetchAPI<Tag[]>(
    `/api/tags/search?q=${encodeURIComponent(query)}`
  );
  return { tags: data || [], error };
}

// ===========================================
// スペース API
// ===========================================

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
  external_links: { label: string; url: string }[];
  is_public: boolean;
  slug: string | null;
  created_at: string;
  updated_at: string;
  subscription_status:
    | "active"
    | "trialing"
    | "past_due"
    | "canceled"
    | "forever_free"
    | null;
  category?: Category;
  tags?: Tag[];
}

export interface SpaceFormData {
  title: string;
  description?: string;
  category_id?: string;
  website_url?: string;
  x_url?: string;
  instagram_url?: string;
  external_links?: { label: string; url: string }[];
  is_public?: boolean;
  slug?: string;
  thumbnail_url?: string;
}

/**
 * ユーザーのスペース一覧取得
 */
export async function getUserSpaces(
  userId: string
): Promise<{ spaces: Space[]; error: string | null }> {
  const { data, error } = await fetchAPI<Space[]>(
    `/api/users/${userId}/spaces`
  );
  return { spaces: data || [], error };
}

/**
 * スペース詳細取得
 */
export async function getSpace(
  spaceId: string
): Promise<{ space: Space | null; error: string | null }> {
  const { data, error } = await fetchAPI<Space>(`/api/spaces/${spaceId}`);
  return { space: data, error };
}

/**
 * 公開スペース取得（slug）
 */
export async function getPublicSpace(
  slug: string
): Promise<{ space: Space | null; error: string | null }> {
  const { data, error } = await fetchAPI<Space>(`/api/public/spaces/${slug}`);
  return { space: data, error };
}

/**
 * スペース作成
 */
export async function createSpace(
  token: string,
  data: SpaceFormData
): Promise<{ space: Space | null; error: string | null }> {
  const { data: result, error } = await fetchAPI<Space>("/api/spaces", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(data),
  });
  return { space: result, error };
}

/**
 * スペース更新
 */
export async function updateSpace(
  token: string,
  spaceId: string,
  data: Partial<SpaceFormData>
): Promise<{ space: Space | null; error: string | null }> {
  const { data: result, error } = await fetchAPI<Space>(
    `/api/spaces/${spaceId}`,
    {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }
  );
  return { space: result, error };
}

/**
 * スペース削除
 */
export async function deleteSpace(
  token: string,
  spaceId: string
): Promise<{ success: boolean; error: string | null }> {
  const { data, error } = await fetchAPI<{ success: boolean }>(
    `/api/spaces/${spaceId}`,
    {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return { success: data?.success || false, error };
}

/**
 * スペースのタグ更新
 */
export async function updateSpaceTags(
  token: string,
  spaceId: string,
  tagIds: string[]
): Promise<{ success: boolean; error: string | null }> {
  const { data, error } = await fetchAPI<{ success: boolean }>(
    `/api/spaces/${spaceId}/tags`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify({ tagIds }),
    }
  );
  return { success: data?.success || false, error };
}
