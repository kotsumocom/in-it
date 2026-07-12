import { useState } from "preact/hooks";

const API_URL = "https://be.init.dev";

interface ProfileFormProps {
  accessToken: string;
  initialDisplayName: string;
  initialAvatarUrl: string | null;
}

export default function ProfileForm({
  accessToken,
  initialDisplayName,
  initialAvatarUrl,
}: ProfileFormProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl || "");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!displayName.trim()) {
      setError("表示名を入力してください");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          display_name: displayName.trim(),
          avatar_url: avatarUrl.trim() || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "更新に失敗しました");
      }

      setSuccess(true);
      setTimeout(() => {
        globalThis.location.href = "/dashboard/profile?profile_updated=true";
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} class="space-y-6">
      {error && (
        <div class="p-4 bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div class="p-4 bg-green-50 border border-green-200 text-green-700">
          プロフィールを更新しました
        </div>
      )}

      {/* 表示吁E*/}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          表示吁E<span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={displayName}
          onInput={(e) => setDisplayName((e.target as HTMLInputElement).value)}
          class="w-full px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          placeholder="侁E 田中太郁E
          required
        />
      </div>

      {/* アバター URL */}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          プロフィール画僁EURL
        </label>
        <input
          type="url"
          value={avatarUrl}
          onInput={(e) => setAvatarUrl((e.target as HTMLInputElement).value)}
          class="w-full px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          placeholder="https://example.com/avatar.jpg"
        />
        <p class="text-sm text-gray-500 mt-1">画像�E URL を�E力してください</p>

        {/* プレビュー */}
        {avatarUrl && (
          <div class="mt-3">
            <p class="text-sm text-gray-600 mb-2">プレビュー:</p>
            <img
              src={avatarUrl}
              alt="プレビュー"
              class="w-24 h-24 rounded-full object-cover border border-gray-200"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {/* 保存�Eタン */}
      <div class="pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          class="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "保存中..." : "変更を保孁E}
        </button>
      </div>
    </form>
  );
}
