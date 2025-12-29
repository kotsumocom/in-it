import { Handlers } from "$fresh/server.ts";
import { supabase } from "@in-it/backend/supabase.ts";
import { State } from "../_middleware.ts";

interface ProgressBody {
  unitId: string;
  status: "completed" | "unlocked" | "locked";
}

export const handler: Handlers<unknown, State> = {
  async POST(req, ctx) {
    // 認証チェック
    if (!ctx.state.user) {
      return new Response(JSON.stringify({ error: "ログインが必要です" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      const body: ProgressBody = await req.json();
      const { unitId, status } = body;

      if (!unitId || !status) {
        return new Response(
          JSON.stringify({ error: "unitId と status は必須です" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // 進捗を更新（upsert）
      const { error } = await supabase.from("user_progress").upsert(
        {
          user_id: ctx.state.user.id,
          unit_id: unitId,
          status,
          completed_at:
            status === "completed" ? new Date().toISOString() : null,
        },
        {
          onConflict: "user_id,unit_id",
        }
      );

      if (error) {
        console.error("Progress update error:", error);
        return new Response(
          JSON.stringify({ error: "進捗の更新に失敗しました" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(JSON.stringify({ success: true, status }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("Progress API error:", e);
      return new Response(
        JSON.stringify({ error: "リクエストの処理に失敗しました" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },

  async GET(_req, ctx) {
    // 認証チェック
    if (!ctx.state.user) {
      return new Response(JSON.stringify({ error: "ログインが必要です" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    try {
      // ユーザーの全進捗を取得
      const { data, error } = await supabase
        .from("user_progress")
        .select("unit_id, status, completed_at")
        .eq("user_id", ctx.state.user.id);

      if (error) {
        console.error("Progress fetch error:", error);
        return new Response(
          JSON.stringify({ error: "進捗の取得に失敗しました" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(JSON.stringify({ progress: data }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (e) {
      console.error("Progress API error:", e);
      return new Response(
        JSON.stringify({ error: "リクエストの処理に失敗しました" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
};
