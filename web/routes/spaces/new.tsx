import { Handlers } from "$fresh/server.ts";

// 旧URL → 新URLへのリダイレクト
export const handler: Handlers = {
  GET(_req, _ctx) {
    return new Response(null, {
      status: 301,
      headers: { Location: "/dashboard/spaces/new" },
    });
  },
};
