import { useState, useRef } from "preact/hooks";

const API_URL = "https://be.in-it.ooo";

interface AvatarUploaderProps {
  accessToken: string;
  userId: string;
  currentAvatarUrl: string | null;
  onUploadComplete: (url: string) => void;
}

export default function AvatarUploader({
  accessToken,
  userId,
  currentAvatarUrl,
  onUploadComplete,
}: AvatarUploaderProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [cropPosition, setCropPosition] = useState({ x: 0, y: 0, size: 200 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

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

  const handleImageLoad = () => {
    if (imageRef.current) {
      const img = imageRef.current;
      const minDim = Math.min(img.naturalWidth, img.naturalHeight);
      const size = Math.min(minDim, 300);
      setCropPosition({
        x: (img.naturalWidth - size) / 2,
        y: (img.naturalHeight - size) / 2,
        size,
      });
    }
  };

  const handleMouseDown = (e: MouseEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - cropPosition.x,
      y: e.clientY - cropPosition.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !imageRef.current) return;
    const img = imageRef.current;
    const newX = Math.max(
      0,
      Math.min(e.clientX - dragStart.x, img.naturalWidth - cropPosition.size)
    );
    const newY = Math.max(
      0,
      Math.min(e.clientY - dragStart.y, img.naturalHeight - cropPosition.size)
    );
    setCropPosition({ ...cropPosition, x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const cropAndUpload = async () => {
    if (!originalImage || !canvasRef.current) return;

    setIsUploading(true);
    setError(null);

    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context error");

      const img = new Image();
      img.src = originalImage;
      await new Promise((resolve) => (img.onload = resolve));

      // 出力サイズ
      const outputSize = 256;
      canvas.width = outputSize;
      canvas.height = outputSize;

      // 円形クリッピング
      ctx.beginPath();
      ctx.arc(outputSize / 2, outputSize / 2, outputSize / 2, 0, Math.PI * 2);
      ctx.clip();

      // 画像描画
      ctx.drawImage(
        img,
        cropPosition.x,
        cropPosition.y,
        cropPosition.size,
        cropPosition.size,
        0,
        0,
        outputSize,
        outputSize
      );

      // Blob 変換
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error("Blob error"))),
          "image/png"
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
      onUploadComplete(avatar_url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsUploading(false);
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setOriginalImage(null);
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

        {/* アップロードボタン */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            class="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            class="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            画像を選択
          </button>
          <p class="mt-1 text-xs text-gray-500">5MB以下の画像ファイル</p>
        </div>
      </div>

      {/* クロップモーダル */}
      {showCropper && originalImage && (
        <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div class="bg-white p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-bold mb-4">画像を調整</h3>

            <div
              class="relative overflow-hidden mb-4 bg-gray-100"
              style={{ maxHeight: "300px" }}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <img
                ref={imageRef}
                src={originalImage}
                onLoad={handleImageLoad}
                class="max-w-full"
                style={{ maxHeight: "300px" }}
              />
              {/* 円形プレビュー枠 */}
              <div
                class="absolute border-4 border-blue-500 rounded-full cursor-move"
                style={{
                  left: `${
                    (cropPosition.x / (imageRef.current?.naturalWidth || 1)) *
                    100
                  }%`,
                  top: `${
                    (cropPosition.y / (imageRef.current?.naturalHeight || 1)) *
                    100
                  }%`,
                  width: `${
                    (cropPosition.size /
                      (imageRef.current?.naturalWidth || 1)) *
                    100
                  }%`,
                  height: `${
                    (cropPosition.size /
                      (imageRef.current?.naturalHeight || 1)) *
                    100
                  }%`,
                }}
                onMouseDown={handleMouseDown}
              />
            </div>

            <p class="text-sm text-gray-500 mb-4">
              円形の枠をドラッグして位置を調整してください
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
                disabled={isUploading}
                class="flex-1 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              >
                {isUploading ? "アップロード中..." : "この画像を使用"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 隠しキャンバス */}
      <canvas ref={canvasRef} class="hidden" />
    </div>
  );
}
