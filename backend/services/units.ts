import { supabase } from "../supabase.ts";

export interface Unit {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  grade_category: string;
  parent_id: string | null;
  content_markdown: string | null;
  estimated_duration: number;
  standard_month: number | null;
  children?: Unit[];
}

export const getUnitsTree = async (): Promise<Unit[]> => {
  const { data, error } = await supabase
    .from("units")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    console.error("Error fetching units:", error);
    throw error;
  }

  // Build tree structure
  const unitsMap = new Map<string, Unit>();
  const rootUnits: Unit[] = [];

  // First pass: create nodes
  data.forEach((unit: any) => {
    unitsMap.set(unit.id, { ...unit, children: [] });
  });

  // Second pass: connect parent-child
  data.forEach((unit: any) => {
    const node = unitsMap.get(unit.id)!;
    if (unit.parent_id) {
      const parent = unitsMap.get(unit.parent_id);
      if (parent) {
        parent.children?.push(node);
      }
    } else {
      rootUnits.push(node);
    }
  });

  return rootUnits;
};
