import { supabase } from "../supabase.ts";

export interface UserProgress {
  unit_id: string;
  status: "locked" | "unlocked" | "completed" | "mastered";
}

export const getUserProgress = async (
  userId: string
): Promise<UserProgress[]> => {
  const { data, error } = await supabase
    .from("user_progress")
    .select("unit_id, status")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching progress:", error);
    throw error;
  }

  return data as UserProgress[];
};

export const updateUserProgress = async (
  userId: string,
  unitId: string,
  status: string
) => {
  const { error } = await supabase
    .from("user_progress")
    .upsert({ user_id: userId, unit_id: unitId, status })
    .select();

  if (error) {
    console.error("Error updating progress:", error);
    throw error;
  }
};
