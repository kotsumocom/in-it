import { Handlers } from "$fresh/server.ts";

// 旧URL → 新URLへのリダイレクト
export const handler: Handlers = {
  GET(_req, ctx) {
    const spaceId = ctx.params.id;
    return new Response(null, {
      status: 301,
      headers: { Location: `/dashboard/spaces/${spaceId}/subscribe` },
    });
  },
  POST(_req, ctx) {
    const spaceId = ctx.params.id;
    return new Response(null, {
      status: 307,
      headers: { Location: `/dashboard/spaces/${spaceId}/subscribe` },
    });
  },
};
