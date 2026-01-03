import { useState } from "preact/hooks";

const API_URL = "https://be.in-it.ooo";

interface DeleteMentorButtonProps {
  accessToken: string | null;
}

export default function DeleteMentorButton({
  accessToken,
}: DeleteMentorButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "本当にメンターデータを削除しますか？\n\n・すべてのスペースが削除されます\n・サブスクリプションが解除されます\n・この操作は取り消せません"
      )
    ) {
      return;
    }

    // 二重確認
    const confirmText = prompt(
      "削除を確定するには「削除」と入力してください："
    );
    if (confirmText !== "削除") {
      alert("削除がキャンセルされました");
      return;
    }

    if (!accessToken) {
      alert("認証が必要です");
      return;
    }

    setIsDeleting(true);

    try {
      const res = await fetch(`${API_URL}/api/profile`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "削除に失敗しました");
      }

      alert("メンターデータを削除しました。ログアウトします。");
      globalThis.location.href = "/logout";
    } catch (err) {
      alert(err instanceof Error ? err.message : "エラーが発生しました");
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      class="text-red-600 hover:text-red-700 text-sm underline disabled:opacity-50"
    >
      {isDeleting ? "削除中..." : "メンターデータを削除"}
    </button>
  );
}
