import { useState } from "preact/hooks";

const API_URL = "https://be.in-it.dev";

interface SpacePublicToggleProps {
  spaceId: string;
  initialValue: boolean;
  accessToken: string | null;
  isSubscribed?: boolean;
  disabled?: boolean;
}

export default function SpacePublicToggle({
  spaceId,
  initialValue,
  accessToken,
  isSubscribed = true,
  disabled = false,
}: SpacePublicToggleProps) {
  const [isPublic, setIsPublic] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    if (!accessToken || isUpdating || disabled) return;

    // 非課金�E場合�Eアラートを表示
    if (!isSubscribed) {
      alert("公開するには、課金また�E無料クーポン期間である忁E��があります、E);
      return;
    }

    const newValue = !isPublic;
    setIsUpdating(true);

    try {
      const res = await fetch(`${API_URL}/api/spaces/${spaceId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ is_public: newValue }),
      });

      if (res.ok) {
        setIsPublic(newValue);
      } else {
        console.error("Failed to update public status");
      }
    } catch (err) {
      console.error("Error updating public status:", err);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isUpdating || disabled}
      class={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
        isPublic ? "bg-blue-600" : "bg-gray-200"
      } ${isUpdating || disabled ? "opacity-50 cursor-not-allowed" : ""} ${
        !isSubscribed ? "opacity-75" : ""
      }`}
      title={
        !isSubscribed
          ? "公開するには課金が忁E��でぁE
          : isPublic
          ? "非�E開にする"
          : "公開すめE
      }
    >
      <span
        class={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isPublic ? "translate-x-5" : "translate-x-0"
        }`}
      />
    </button>
  );
}
