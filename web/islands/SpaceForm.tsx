import { useState } from "preact/hooks";
import type { Category, Tag, SpaceFormData } from "../lib/api.ts";

const API_URL = "https://be.in-it.ooo";

interface SpaceFormProps {
  mode: "create" | "edit";
  spaceId?: string;
  initialData?: Partial<SpaceFormData>;
  initialTagIds?: string[];
  categories: Category[];
  tags: Tag[];
  accessToken: string | null;
}

export default function SpaceForm({
  mode,
  spaceId,
  initialData = {},
  initialTagIds = [],
  categories,
  tags,
  accessToken,
}: SpaceFormProps) {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [categoryId, setCategoryId] = useState(initialData.category_id || "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTagIds);
  const [websiteUrl, setWebsiteUrl] = useState(initialData.website_url || "");
  const [xUrl, setXUrl] = useState(initialData.x_url || "");
  const [instagramUrl, setInstagramUrl] = useState(
    initialData.instagram_url || ""
  );
  const [slug, setSlug] = useState(initialData.slug || "");
  const [isPublic, setIsPublic] = useState(initialData.is_public || false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // カテゴリでフィルタされたタグ
  const filteredTags = categoryId
    ? tags.filter((tag) => tag.category_id === categoryId || !tag.category_id)
    : tags;

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("タイトルを入力してください");
      return;
    }

    if (!accessToken) {
      setError("認証が必要です。再度ログインしてください。");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData: SpaceFormData = {
        title: title.trim(),
        description: description.trim() || undefined,
        category_id: categoryId || undefined,
        website_url: websiteUrl.trim() || undefined,
        x_url: xUrl.trim() || undefined,
        instagram_url: instagramUrl.trim() || undefined,
        slug: slug.trim() || undefined,
        is_public: isPublic,
      };

      let resultSpace;

      if (mode === "create") {
        // スペース作成
        const res = await fetch(`${API_URL}/api/spaces`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "スペースの作成に失敗しました");
        }

        resultSpace = await res.json();
      } else {
        // スペース更新
        const res = await fetch(`${API_URL}/api/spaces/${spaceId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "スペースの更新に失敗しました");
        }

        resultSpace = await res.json();
      }

      // タグを設定
      if (resultSpace && selectedTagIds.length > 0) {
        await fetch(`${API_URL}/api/spaces/${resultSpace.id}/tags`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ tagIds: selectedTagIds }),
        });
      }

      // ダッシュボードにリダイレクト
      globalThis.location.href =
        mode === "create"
          ? "/dashboard?created=true"
          : "/dashboard?updated=true";
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("本当にこのスペースを削除しますか？")) {
      return;
    }

    if (!accessToken || !spaceId) {
      setError("認証が必要です。");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/spaces/${spaceId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "削除に失敗しました");
      }

      globalThis.location.href = "/dashboard?deleted=true";
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
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

      {/* タイトル */}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          タイトル <span class="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={title}
          onInput={(e) => setTitle((e.target as HTMLInputElement).value)}
          class="w-full px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          placeholder="例: Pythonプログラミング入門"
          required
        />
      </div>

      {/* カテゴリ */}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          カテゴリ
        </label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId((e.target as HTMLSelectElement).value)}
          class="w-full px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
        >
          <option value="">選択してください</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.display_name}
            </option>
          ))}
        </select>
      </div>

      {/* タグ */}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          タグ（複数選択可）
        </label>
        <div class="flex flex-wrap gap-2 p-4 border border-gray-200 bg-gray-50 max-h-48 overflow-y-auto">
          {filteredTags.map((tag) => (
            <button
              key={tag.id}
              type="button"
              onClick={() => handleTagToggle(tag.id)}
              class={`px-3 py-1 text-sm border transition-colors ${
                selectedTagIds.includes(tag.id)
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 border-gray-300 hover:border-blue-400"
              }`}
            >
              {tag.display_name}
            </button>
          ))}
        </div>
        {selectedTagIds.length > 0 && (
          <p class="text-sm text-gray-500 mt-1">
            {selectedTagIds.length}個のタグを選択中
          </p>
        )}
      </div>

      {/* 説明 */}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">説明</label>
        <textarea
          value={description}
          onInput={(e) =>
            setDescription((e.target as HTMLTextAreaElement).value)
          }
          class="w-full px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none min-h-32"
          placeholder="スペースの説明を入力してください"
        />
      </div>

      {/* 外部リンク */}
      <div class="space-y-4">
        <h3 class="text-sm font-medium text-gray-700">外部リンク</h3>
        <div class="grid gap-4">
          <div>
            <label class="block text-sm text-gray-600 mb-1">Website</label>
            <input
              type="url"
              value={websiteUrl}
              onInput={(e) =>
                setWebsiteUrl((e.target as HTMLInputElement).value)
              }
              class="w-full px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="https://example.com"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">X (Twitter)</label>
            <input
              type="url"
              value={xUrl}
              onInput={(e) => setXUrl((e.target as HTMLInputElement).value)}
              class="w-full px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="https://x.com/username"
            />
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Instagram</label>
            <input
              type="url"
              value={instagramUrl}
              onInput={(e) =>
                setInstagramUrl((e.target as HTMLInputElement).value)
              }
              class="w-full px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
              placeholder="https://instagram.com/username"
            />
          </div>
        </div>
      </div>

      {/* Slug */}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          URL（スラッグ）
        </label>
        <div class="flex items-center">
          <span class="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 text-gray-500">
            in-it.ooo/s/
          </span>
          <input
            type="text"
            value={slug}
            onInput={(e) => setSlug((e.target as HTMLInputElement).value)}
            class="flex-1 px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            placeholder="my-space"
            pattern="[a-z0-9-]+"
          />
        </div>
        <p class="text-sm text-gray-500 mt-1">
          半角英数字とハイフンのみ使用できます
        </p>
      </div>

      {/* 公開設定 */}
      <div class="flex items-center gap-3">
        <input
          type="checkbox"
          id="is_public"
          checked={isPublic}
          onChange={(e) => setIsPublic((e.target as HTMLInputElement).checked)}
          class="w-4 h-4"
        />
        <label htmlFor="is_public" class="text-sm text-gray-700">
          このスペースを公開する
        </label>
      </div>

      {/* ボタン */}
      <div class="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting}
          class="px-6 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting
            ? "処理中..."
            : mode === "create"
            ? "スペースを作成"
            : "変更を保存"}
        </button>

        {mode === "edit" && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            class="px-6 py-2 border border-red-300 text-red-600 font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            削除
          </button>
        )}
      </div>
    </form>
  );
}
