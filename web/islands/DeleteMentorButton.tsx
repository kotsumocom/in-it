import { useState } from "preact/hooks";

const API_URL = "https://be.in-it.dev";

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
        "本当にメンターチE�Eタを削除しますか�E�\n\n・すべてのスペ�Eスが削除されます\n・サブスクリプションが解除されます\n・こ�E操作�E取り消せません"
      )
    ) {
      return;
    }

    // 二重確誁E
    const confirmText = prompt(
      "削除を確定するには「削除」と入力してください�E�E
    );
    if (confirmText !== "削除") {
      alert("削除がキャンセルされました");
      return;
    }

    if (!accessToken) {
      alert("認証が忁E��でぁE);
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

      alert("メンターチE�Eタを削除しました。ログアウトします、E);
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
      class="px-4 py-1.5 text-sm text-red-600 border border-red-300 hover:bg-red-50 disabled:opacity-50"
    >
      {isDeleting ? "削除中..." : "メンターチE�Eタを削除"}
    </button>
  );
}
