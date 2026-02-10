import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../../_middleware.ts";
import { getCategories, getTags } from "../../../lib/api.ts";
import type { Category, Tag } from "../../../lib/api.ts";
import SpaceForm from "../../../islands/SpaceForm.tsx";
import DashboardLayout from "../../../components/DashboardLayout.tsx";

interface NewSpaceData {
  user: State["user"];
  categories: Category[];
  tags: Tag[];
  accessToken: string | null;
}

export const handler: Handlers<NewSpaceData, State> = {
  async GET(req, ctx) {
    if (!ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login" },
      });
    }

    const [{ categories }, { tags }] = await Promise.all([
      getCategories(),
      getTags(),
    ]);

    const cookies = req.headers.get("cookie") || "";
    const accessToken = getCookie(cookies, "access_token");

    return ctx.render({
      user: ctx.state.user,
      categories,
      tags,
      accessToken,
    });
  },
};

function getCookie(cookies: string, name: string): string | null {
  const match = cookies.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
}

export default function NewSpacePage({ data }: PageProps<NewSpaceData>) {
  const { categories, tags, accessToken } = data;

  return (
    <DashboardLayout activeSection="spaces">
      <div class="max-w-2xl">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">
          新しいスペースを作成
        </h1>

        <div class="bg-white border border-gray-200 p-6">
          <SpaceForm
            mode="create"
            categories={categories}
            tags={tags}
            accessToken={accessToken}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
