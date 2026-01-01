import { useState } from "preact/hooks";

interface ReferralCodeProps {
  code: string;
  baseUrl: string;
}

export default function ReferralCode({ code, baseUrl }: ReferralCodeProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // フォールバック: テキスト選択
      const textArea = document.createElement("textarea");
      textArea.value = code;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareUrl = `${baseUrl}/signup?ref=${code}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "in-it - 手数料ゼロのメンタープラットフォーム",
          text: "in-it で一緒にメンターを始めませんか？招待コードで初月無料！",
          url: shareUrl,
        });
      } catch {
        // キャンセルされた場合は何もしない
      }
    } else {
      // Web Share API 非対応の場合は URL をコピー
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div>
      <p class="text-gray-600 mb-2">あなたの招待コード:</p>
      <div class="flex items-center gap-2 mb-4">
        <code class="px-4 py-2 bg-gray-100 text-lg font-mono tracking-wider">
          {code}
        </code>
        <button
          type="button"
          onClick={handleCopy}
          class={`px-3 py-2 border transition-colors ${
            copied
              ? "border-green-500 text-green-600 bg-green-50"
              : "border-gray-300 text-gray-700 hover:bg-gray-50"
          }`}
        >
          {copied ? "✓ コピー済" : "コピー"}
        </button>
      </div>

      <div class="flex gap-2 mb-4">
        <button
          type="button"
          onClick={handleShare}
          class="flex-1 px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
        >
          📤 招待リンクを共有
        </button>
      </div>

      <div class="p-4 bg-blue-50 border border-blue-100">
        <p class="text-blue-700 text-sm font-medium mb-1">✨ 招待特典</p>
        <ul class="text-blue-700 text-sm space-y-1">
          <li>• 招待された人: 初月無料</li>
          <li>• 招待した人: 1,000円クレジット</li>
        </ul>
      </div>
    </div>
  );
}
