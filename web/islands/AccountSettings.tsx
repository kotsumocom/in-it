import { useState } from "preact/hooks";

const API_URL = "https://be.in-it.ooo";

interface AccountSettingsProps {
  accessToken: string | null;
  currentEmail: string;
}

export default function AccountSettings({
  accessToken,
  currentEmail,
}: AccountSettingsProps) {
  const [isEmailOpen, setIsEmailOpen] = useState(false);
  const [isPasswordOpen, setIsPasswordOpen] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleEmailChange = async (e: Event) => {
    e.preventDefault();
    if (!accessToken) {
      setMessage({ type: "error", text: "認証が必要です" });
      return;
    }

    if (!newEmail) {
      setMessage({
        type: "error",
        text: "新しいメールアドレスを入力してください",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/account/email`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ email: newEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "メールアドレスの変更に失敗しました");
      }

      setMessage({
        type: "success",
        text: "確認メールを送信しました。新しいメールアドレスのリンクをクリックして変更を完了してください。",
      });
      setNewEmail("");
      setIsEmailOpen(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "エラーが発生しました",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: Event) => {
    e.preventDefault();
    if (!accessToken) {
      setMessage({ type: "error", text: "認証が必要です" });
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "すべての項目を入力してください" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "新しいパスワードが一致しません" });
      return;
    }

    if (newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "パスワードは6文字以上で入力してください",
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch(`${API_URL}/api/account/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "パスワードの変更に失敗しました");
      }

      setMessage({
        type: "success",
        text: "パスワードを変更しました。",
      });
      setNewPassword("");
      setConfirmPassword("");
      setIsPasswordOpen(false);
    } catch (err) {
      setMessage({
        type: "error",
        text: err instanceof Error ? err.message : "エラーが発生しました",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section class="p-6 bg-white border border-gray-200">
      <h2 class="text-lg font-bold text-gray-900 mb-4">アカウント設定</h2>

      {message && (
        <div
          class={`mb-4 p-3 text-sm ${
            message.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* 現在のメールアドレス表示 */}
      <div class="mb-4">
        <p class="text-sm text-gray-600">
          現在のメールアドレス: <span class="font-medium">{currentEmail}</span>
        </p>
      </div>

      {/* メールアドレス変更 */}
      <div class="mb-4">
        <button
          type="button"
          onClick={() => {
            setIsEmailOpen(!isEmailOpen);
            setIsPasswordOpen(false);
            setMessage(null);
          }}
          class="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {isEmailOpen
            ? "▼ メールアドレス変更を閉じる"
            : "▶ メールアドレスを変更"}
        </button>
        {isEmailOpen && (
          <form onSubmit={handleEmailChange} class="mt-3 space-y-3">
            <div>
              <label class="block text-sm text-gray-700 mb-1">
                新しいメールアドレス
              </label>
              <input
                type="email"
                value={newEmail}
                onInput={(e) =>
                  setNewEmail((e.target as HTMLInputElement).value)
                }
                class="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="new@example.com"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "送信中..." : "確認メールを送信"}
            </button>
          </form>
        )}
      </div>

      {/* パスワード変更 */}
      <div>
        <button
          type="button"
          onClick={() => {
            setIsPasswordOpen(!isPasswordOpen);
            setIsEmailOpen(false);
            setMessage(null);
          }}
          class="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          {isPasswordOpen ? "▼ パスワード変更を閉じる" : "▶ パスワードを変更"}
        </button>
        {isPasswordOpen && (
          <form onSubmit={handlePasswordChange} class="mt-3 space-y-3">
            <div>
              <label class="block text-sm text-gray-700 mb-1">
                新しいパスワード
              </label>
              <input
                type="password"
                value={newPassword}
                onInput={(e) =>
                  setNewPassword((e.target as HTMLInputElement).value)
                }
                class="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="6文字以上"
              />
            </div>
            <div>
              <label class="block text-sm text-gray-700 mb-1">
                新しいパスワード（確認）
              </label>
              <input
                type="password"
                value={confirmPassword}
                onInput={(e) =>
                  setConfirmPassword((e.target as HTMLInputElement).value)
                }
                class="w-full px-3 py-2 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                placeholder="もう一度入力"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              class="px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "変更中..." : "パスワードを変更"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
