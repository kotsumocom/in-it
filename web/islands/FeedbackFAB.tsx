import { useState } from "preact/hooks";

interface FeedbackFABProps {
  spaceId?: string;
  accessToken?: string;
}

export default function FeedbackFAB({
  spaceId,
  accessToken,
}: FeedbackFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<"bug" | "feature" | "question">(
    "question"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const API_URL = "https://be.init.dev";

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!message.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

      const res = await fetch(`${API_URL}/api/feedbacks`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          message: message.trim(),
          category,
          page_url:
            typeof window !== "undefined" ? window.location.href : undefined,
          space_id: spaceId || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "送信に失敗しました");
      }

      setSubmitted(true);
      setMessage("");
      setTimeout(() => {
        setSubmitted(false);
        setIsOpen(false);
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryLabels = {
    bug: "🐛 バグ報呁E,
    feature: "💡 機�EリクエスチE,
    question: "❁E質問�Eそ�E仁E,
  };

  return (
    <>
      {/* FAB Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        class="fixed bottom-6 right-6 z-50 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-200 hover:scale-105"
        aria-label="フィードバチE��を送る"
      >
        {isOpen ? (
          <svg
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
        )}
      </button>

      {/* Feedback Modal */}
      {isOpen && (
        <div class="fixed bottom-24 right-6 z-50 w-80 bg-white rounded-lg shadow-xl border border-gray-200">
          <div class="p-4 border-b border-gray-200">
            <h3 class="font-bold text-gray-900">フィードバチE��を送る</h3>
            <p class="text-sm text-gray-500">
              ご意見�Eご要望をお聞かせください
            </p>
          </div>

          {submitted ? (
            <div class="p-6 text-center">
              <div class="text-4xl mb-2">✁E/div>
              <p class="text-gray-700 font-medium">送信しました�E�E/p>
              <p class="text-sm text-gray-500">ご協力ありがとぁE��ざいまぁE/p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} class="p-4 space-y-4">
              {/* Category Selection */}
              <div class="flex gap-2">
                {(
                  Object.keys(categoryLabels) as Array<
                    keyof typeof categoryLabels
                  >
                ).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    class={`flex-1 py-2 px-2 text-xs rounded transition-colors ${
                      category === key
                        ? "bg-blue-100 text-blue-700 border border-blue-300"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent"
                    }`}
                  >
                    {categoryLabels[key]}
                  </button>
                ))}
              </div>

              {/* Message Input */}
              <textarea
                value={message}
                onInput={(e) =>
                  setMessage((e.target as HTMLTextAreaElement).value)
                }
                placeholder="メチE��ージを�E劁E.."
                class="w-full h-24 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                required
              />

              {error && <p class="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={isSubmitting || !message.trim()}
                class="w-full py-2 bg-blue-600 text-white font-medium rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "送信中..." : "送信"}
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
