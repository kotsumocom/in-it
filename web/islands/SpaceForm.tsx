import { useState, useRef, useEffect } from "preact/hooks";
import type { Category, Tag, SpaceFormData } from "../lib/api.ts";
import BlockEditor from "./BlockEditor.tsx";

const API_URL = "https://be.in-it.ooo";

interface SpaceFormProps {
  mode: "create" | "edit";
  spaceId?: string;
  initialData?: Partial<SpaceFormData>;
  initialTagIds?: string[];
  initialCustomTags?: string[];
  categories: Category[];
  tags: Tag[];
  accessToken: string | null;
  isSubscribed?: boolean; // サブスクリプション状態
}

export default function SpaceForm({
  mode,
  spaceId,
  initialData = {},
  initialTagIds = [],
  initialCustomTags = [],
  categories,
  tags,
  accessToken,
  isSubscribed = false,
}: SpaceFormProps) {
  const [title, setTitle] = useState(initialData.title || "");
  const [description, setDescription] = useState(initialData.description || "");
  const [categoryId, setCategoryId] = useState(initialData.category_id || "");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(initialTagIds);
  const [customTags, setCustomTags] = useState<string[]>(initialCustomTags);
  const [websiteUrl, setWebsiteUrl] = useState(initialData.website_url || "");
  // X/Instagramはユーザー名のみ保存（@なし）
  const [xUsername, setXUsername] = useState(
    initialData.x_url
      ? initialData.x_url.replace(/^.*\//, "").replace(/^@/, "")
      : "",
  );
  const [instagramUsername, setInstagramUsername] = useState(
    initialData.instagram_url
      ? initialData.instagram_url.replace(/^.*\//, "").replace(/^@/, "")
      : "",
  );
  const [isPublic, setIsPublic] = useState(initialData.is_public || false);
  const [thumbnailUrl, setThumbnailUrl] = useState(
    initialData.thumbnail_url || "",
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  // タグ検索・入力用
  const [tagSearch, setTagSearch] = useState("");
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  // カテゴリでフィルタされたタグ + 検索フィルタ
  const filteredTags = tags.filter((tag) => {
    const matchesCategory =
      !categoryId || tag.category_id === categoryId || !tag.category_id;
    const matchesSearch =
      !tagSearch ||
      tag.display_name.toLowerCase().includes(tagSearch.toLowerCase()) ||
      tag.name.toLowerCase().includes(tagSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleAddCustomTag = () => {
    const trimmed = tagSearch.trim();
    if (!trimmed) return;

    // 既存タグに一致するかチェック
    const existingTag = tags.find(
      (t) => t.display_name.toLowerCase() === trimmed.toLowerCase(),
    );

    if (existingTag) {
      // 既存タグを選択
      if (!selectedTagIds.includes(existingTag.id)) {
        setSelectedTagIds((prev) => [...prev, existingTag.id]);
      }
    } else {
      // カスタムタグとして追加
      if (!customTags.includes(trimmed)) {
        setCustomTags((prev) => [...prev, trimmed]);
      }
    }

    setTagSearch("");
    setShowTagDropdown(false);
  };

  const handleRemoveCustomTag = (tag: string) => {
    setCustomTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCustomTag();
    }
  };

  // 選択されたタグの表示名を取得
  const getTagDisplayName = (tagId: string) => {
    const tag = tags.find((t) => t.id === tagId);
    return tag?.display_name || "";
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
        x_url: xUsername.trim()
          ? `https://x.com/${xUsername.trim()}`
          : undefined,
        instagram_url: instagramUsername.trim()
          ? `https://instagram.com/${instagramUsername.trim()}`
          : undefined,
        is_public: isPublic,
        thumbnail_url: thumbnailUrl.trim() || undefined,
      };

      let resultSpace;

      if (mode === "create") {
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
      if (resultSpace) {
        await fetch(`${API_URL}/api/spaces/${resultSpace.id}/tags`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            tagIds: selectedTagIds,
            customTags: customTags,
          }),
        });
      }

      globalThis.location.href =
        mode === "create"
          ? "/dashboard/spaces?created=true"
          : "/dashboard/spaces?updated=true";
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

      globalThis.location.href = "/dashboard/spaces?deleted=true";
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
      setIsSubmitting(false);
    }
  };

  // ドロップダウン外クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        tagInputRef.current &&
        !tagInputRef.current.contains(e.target as Node)
      ) {
        setShowTagDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

      {/* カテゴリ - コンボボックス */}
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

      {/* タグ - 検索可能なコンボボックス + 自由入力 */}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          タグ（複数選択・自由入力可）
        </label>

        {/* 選択済みタグ表示 */}
        <div class="flex flex-wrap gap-2 mb-2">
          {selectedTagIds.map((tagId) => (
            <span
              key={tagId}
              class="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
            >
              {getTagDisplayName(tagId)}
              <button
                type="button"
                onClick={() => handleTagToggle(tagId)}
                class="hover:text-blue-900"
              >
                ×
              </button>
            </span>
          ))}
          {customTags.map((tag) => (
            <span
              key={tag}
              class="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveCustomTag(tag)}
                class="hover:text-purple-900"
              >
                ×
              </button>
            </span>
          ))}
        </div>

        {/* 検索入力 */}
        <div class="relative" ref={tagInputRef}>
          <input
            type="text"
            value={tagSearch}
            onInput={(e) => {
              setTagSearch((e.target as HTMLInputElement).value);
              setShowTagDropdown(true);
            }}
            onFocus={() => setShowTagDropdown(true)}
            onKeyDown={handleTagKeyDown}
            placeholder="タグを検索・入力..."
            class="w-full px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
          />

          {/* タグドロップダウン */}
          {showTagDropdown && (
            <div class="absolute z-10 w-full mt-1 bg-white border border-gray-200 shadow-lg max-h-48 overflow-y-auto">
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => {
                      handleTagToggle(tag.id);
                      setTagSearch("");
                    }}
                    class={`w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center justify-between ${
                      selectedTagIds.includes(tag.id) ? "bg-blue-50" : ""
                    }`}
                  >
                    <span>{tag.display_name}</span>
                    {selectedTagIds.includes(tag.id) && (
                      <span class="text-blue-600">✓</span>
                    )}
                  </button>
                ))
              ) : tagSearch.trim() ? (
                <button
                  type="button"
                  onClick={handleAddCustomTag}
                  class="w-full px-4 py-2 text-left hover:bg-purple-50 text-purple-700"
                >
                  「{tagSearch}」を追加
                </button>
              ) : (
                <div class="px-4 py-2 text-gray-500">タグが見つかりません</div>
              )}
            </div>
          )}
        </div>

        <p class="text-sm text-gray-500 mt-1">
          {selectedTagIds.length + customTags.length > 0
            ? `${selectedTagIds.length + customTags.length}個選択中`
            : "Enterで自由入力も可能"}
        </p>
      </div>

      {/* サムネイル画像 */}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">
          サムネイル画像
        </label>
        <div class="flex items-center gap-4">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt="サムネイル"
              class="w-32 h-20 object-cover border border-gray-200"
            />
          ) : (
            <div class="w-32 h-20 bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-400">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
              </svg>
            </div>
          )}
          <div>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (!file || !accessToken) return;
                setIsUploadingThumbnail(true);
                try {
                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("spaceId", spaceId || "temp");
                  formData.append("type", "thumbnail");
                  const res = await fetch(
                    `${API_URL}/api/spaces/upload-image`,
                    {
                      method: "POST",
                      headers: { Authorization: `Bearer ${accessToken}` },
                      body: formData,
                    },
                  );
                  const data = await res.json();
                  if (data.file?.url) {
                    setThumbnailUrl(data.file.url);
                  }
                } catch (err) {
                  console.error("Thumbnail upload error:", err);
                } finally {
                  setIsUploadingThumbnail(false);
                }
              }}
              class="hidden"
            />
            <div class="flex gap-2">
              <button
                type="button"
                onClick={() => thumbnailInputRef.current?.click()}
                disabled={isUploadingThumbnail}
                class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                {isUploadingThumbnail ? "アップロード中..." : "画像を選択"}
              </button>
              {thumbnailUrl && (
                <button
                  type="button"
                  onClick={() => setThumbnailUrl("")}
                  class="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50"
                >
                  削除
                </button>
              )}
            </div>
            <p class="mt-1 text-xs text-gray-500">推奨: 16:10 比率</p>
          </div>
        </div>
      </div>

      {/* 説明（ブロックエディタ） */}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">説明</label>
        <BlockEditor
          initialData={description}
          accessToken={accessToken || ""}
          spaceId={spaceId}
          onChange={(data) => setDescription(data)}
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
            <div class="flex items-center">
              <span class="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 text-gray-500">
                @
              </span>
              <input
                type="text"
                value={xUsername}
                onInput={(e) =>
                  setXUsername(
                    (e.target as HTMLInputElement).value.replace(/^@/, ""),
                  )
                }
                class="flex-1 px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="username"
              />
            </div>
          </div>
          <div>
            <label class="block text-sm text-gray-600 mb-1">Instagram</label>
            <div class="flex items-center">
              <span class="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 text-gray-500">
                @
              </span>
              <input
                type="text"
                value={instagramUsername}
                onInput={(e) =>
                  setInstagramUsername(
                    (e.target as HTMLInputElement).value.replace(/^@/, ""),
                  )
                }
                class="flex-1 px-4 py-2 border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                placeholder="username"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Slug - 自動生成のため非表示（スペース作成時に運営が自動割り振り） */}

      {/* 公開設定 - 課金ユーザーのみ表示 */}
      {isSubscribed && (
        <div class="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_public"
            checked={isPublic}
            onChange={(e) =>
              setIsPublic((e.target as HTMLInputElement).checked)
            }
            class="w-4 h-4"
          />
          <label htmlFor="is_public" class="text-sm text-gray-700">
            このスペースを公開する
          </label>
        </div>
      )}

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

        <button
          type="button"
          onClick={() => (globalThis.location.href = "/dashboard/spaces")}
          disabled={isSubmitting}
          class="px-6 py-2 border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          キャンセル
        </button>
      </div>

      {/* デンジャーゾーン（編集時のみ） */}
      {mode === "edit" && (
        <div class="mt-12 pt-6 border-t border-red-200">
          <h3 class="text-lg font-medium text-red-600 mb-2">
            デンジャーゾーン
          </h3>
          <p class="text-sm text-gray-600 mb-4">
            スペースを削除すると、すべてのデータが完全に削除されます。この操作は取り消せません。
          </p>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isSubmitting}
            class="px-6 py-2 bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            スペースを削除
          </button>
        </div>
      )}
    </form>
  );
}
