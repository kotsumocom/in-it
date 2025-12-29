import { useState } from "preact/hooks";

interface ProgressButtonProps {
  unitId: string;
  initialStatus: "completed" | "unlocked" | "locked" | null;
  isLoggedIn: boolean;
}

export default function ProgressButton({
  unitId,
  initialStatus,
  isLoggedIn,
}: ProgressButtonProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);

  const isCompleted = status === "completed";

  const handleToggle = async () => {
    if (!isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    setIsLoading(true);
    const newStatus = isCompleted ? "unlocked" : "completed";

    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ unitId, status: newStatus }),
      });

      if (res.ok) {
        setStatus(newStatus);
      } else {
        const data = await res.json();
        alert(data.error || "エラーが発生しました");
      }
    } catch (e) {
      console.error("Progress update error:", e);
      alert("通信エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      class={`
        w-full py-4 rounded-xl font-bold text-lg transition-all duration-300
        flex items-center justify-center gap-3
        ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
        ${
          isCompleted
            ? "bg-green-500/20 text-green-400 border-2 border-green-500 hover:bg-green-500/30"
            : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/50"
        }
      `}
    >
      {isLoading ? (
        <span class="animate-pulse">処理中...</span>
      ) : isCompleted ? (
        <>
          <span class="text-2xl">✓</span>
          <span>完了済み</span>
          <span class="text-sm text-green-300">（クリックで取り消し）</span>
        </>
      ) : (
        <>
          <span class="text-2xl">📚</span>
          <span>
            {isLoggedIn ? "この単元を完了にする" : "ログインして進捗を記録"}
          </span>
        </>
      )}
    </button>
  );
}
