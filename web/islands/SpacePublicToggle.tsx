import { useState } from "preact/hooks";

const API_URL = "https://be.in-it.ooo";

interface SpacePublicToggleProps {
  spaceId: string;
  initialValue: boolean;
  accessToken: string | null;
  disabled?: boolean;
}

export default function SpacePublicToggle({
  spaceId,
  initialValue,
  accessToken,
  disabled = false,
}: SpacePublicToggleProps) {
  const [isPublic, setIsPublic] = useState(initialValue);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleToggle = async () => {
    if (!accessToken || isUpdating || disabled) return;

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
      } ${isUpdating || disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      title={
        disabled
          ? "課金するとトグル可能になります"
          : isPublic
          ? "非公開にする"
          : "公開する"
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
