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
