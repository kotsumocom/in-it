import { useState, useRef, useEffect } from "preact/hooks";

const API_URL = "https://be.in-it.ooo";

// Cropper.js CDN URLs
const CROPPER_JS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.js";
const CROPPER_CSS_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/cropperjs/1.6.1/cropper.min.css";

interface AvatarUploaderProps {
  accessToken: string;
  userId: string;
  currentAvatarUrl: string | null;
}

// deno-lint-ignore no-explicit-any
declare const Cropper: any;

export default function AvatarUploader({
  accessToken,
  userId,
  currentAvatarUrl,
}: AvatarUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [cropperLoaded, setCropperLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  // deno-lint-ignore no-explicit-any
  const cropperRef = useRef<any>(null);

  // Cropper.js の動的読み込み
  useEffect(() => {
    if (typeof window !== "undefined" && !cropperLoaded) {
      // CSS 読み込み
      if (!document.querySelector(`link[href="${CROPPER_CSS_URL}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = CROPPER_CSS_URL;
        document.head.appendChild(link);
      }

      // JS 読み込み
      if (!document.querySelector(`script[src="${CROPPER_JS_URL}"]`)) {
        const script = document.createElement("script");
        script.src = CROPPER_JS_URL;
        script.onload = () => setCropperLoaded(true);
        document.body.appendChild(script);
      } else if (typeof Cropper !== "undefined") {
        setCropperLoaded(true);
      }
    }
  }, []);

  // Cropper インスタンスの初期化
  useEffect(() => {
    if (
      showCropper &&
      cropperLoaded &&
      imageRef.current &&
      !cropperRef.current
    ) {
      cropperRef.current = new Cropper(imageRef.current, {
        aspectRatio: 1,
        viewMode: 1,
        dragMode: "move",
        cropBoxResizable: true,
        cropBoxMovable: true,
        minCropBoxWidth: 100,
        minCropBoxHeight: 100,
        background: false,
        guides: false,
        center: true,
        highlight: false,
        ready() {
          // 円形プレビュー用のスタイルを適用
          const cropBox = document.querySelector(".cropper-crop-box");
          if (cropBox) {
            (cropBox as HTMLElement).style.borderRadius = "50%";
          }
          const viewBox = document.querySelector(".cropper-view-box");
          if (viewBox) {
            (viewBox as HTMLElement).style.borderRadius = "50%";
            (viewBox as HTMLElement).style.outline = "none";
          }
          const face = document.querySelector(".cropper-face");
          if (face) {
            (face as HTMLElement).style.borderRadius = "50%";
          }
        },
      });
    }

    return () => {
      if (cropperRef.current) {
        cropperRef.current.destroy();
        cropperRef.current = null;
      }
    };
  }, [showCropper, cropperLoaded, originalImage]);

  const handleFileSelect = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("画像ファイルを選択してください");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("ファイルサイズは5MB以下にしてください");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setOriginalImage(e.target?.result as string);
      setShowCropper(true);
      setError(null);
    };
    reader.readAsDataURL(file);
  };

  const cropAndUpload = async () => {
    if (!cropperRef.current) return;

    setIsUploading(true);
    setError(null);

    try {
      // 円形にクロップした画像を取得
      const canvas = cropperRef.current.getCroppedCanvas({
        width: 256,
        height: 256,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: "high",
      });

      // 円形マスクを適用
      const circularCanvas = document.createElement("canvas");
      circularCanvas.width = 256;
      circularCanvas.height = 256;
      const ctx = circularCanvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context error");

      ctx.beginPath();
      ctx.arc(128, 128, 128, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(canvas, 0, 0, 256, 256);

      // Blob 変換
      const blob = await new Promise<Blob>((resolve, reject) => {
        circularCanvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Blob error"))),
          "image/png",
        );
      });

      // アップロード
      const formData = new FormData();
      formData.append("file", blob, `avatar-${userId}.png`);

      const res = await fetch(`${API_URL}/api/profile/avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "アップロードに失敗しました");
      }

      const { avatar_url } = await res.json();
      setPreviewUrl(avatar_url);
      setShowCropper(false);
      setOriginalImage(null);
      // ページをリロードして最新の画像を表示
      globalThis.location.reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsUploading(false);
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setOriginalImage(null);
    if (cropperRef.current) {
      cropperRef.current.destroy();
      cropperRef.current = null;
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div class="mb-6">
      <label class="block text-sm font-medium text-gray-700 mb-2">
        プロフィール画像
      </label>

      {error && (
        <div class="mb-3 p-2 bg-red-50 border border-red-200 text-red-600 text-sm">
          {error}
        </div>
      )}

      <div class="flex items-center gap-4">
        {/* 現在のアバター */}
        <div class="relative">
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="プロフィール画像"
              class="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div class="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400">
              <svg class="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
            </div>
          )}
        </div>

        {/* アップロード・削除ボタン */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            class="hidden"
          />
          <div class="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
            >
              画像を選択
            </button>
            {previewUrl && (
              <button
                type="button"
                onClick={async () => {
                  try {
                    const res = await fetch(`${API_URL}/api/profile/avatar`, {
                      method: "DELETE",
                      headers: {
                        Authorization: `Bearer ${accessToken}`,
                      },
                    });
                    if (res.ok) {
                      setPreviewUrl(null);
                      // ページをリロードして最新の状態を表示
                      globalThis.location.reload();
                    }
                  } catch (err) {
                    console.error("Delete error:", err);
                  }
                }}
                class="px-4 py-2 border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
              >
                削除
              </button>
            )}
          </div>
          <p class="mt-1 text-xs text-gray-500">5MB以下の画像ファイル</p>
        </div>
      </div>

      {/* クロップモーダル */}
      {showCropper && originalImage && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 max-w-lg w-full mx-4">
            <h3 class="text-lg font-bold mb-4">画像を調整</h3>

            <div class="mb-4" style={{ maxHeight: "400px" }}>
              <img
                ref={imageRef}
                src={originalImage}
                alt="クロップ対象"
                style={{ maxWidth: "100%", display: "block" }}
              />
            </div>

            <p class="text-sm text-gray-500 mb-4">
              ドラッグして位置を調整、枠をドラッグしてサイズを変更できます
            </p>

            <div class="flex gap-3">
              <button
                type="button"
                onClick={cancelCrop}
                class="flex-1 px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                キャンセル
              </button>
              <button
                type="button"
                onClick={cropAndUpload}
                disabled={isUploading || !cropperLoaded}
                class="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isUploading ? "アップロード中..." : "この画像を使用"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
