import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../../../_middleware.ts";
import { getCategories, getTags, getSpace } from "../../../../lib/api.ts";
import type { Category, Tag, Space } from "../../../../lib/api.ts";
import SpaceForm from "../../../../islands/SpaceForm.tsx";
import DashboardLayout from "../../../../components/DashboardLayout.tsx";

interface EditSpaceData {
  user: State["user"];
  space: Space;
  categories: Category[];
  tags: Tag[];
  accessToken: string | null;
}

export const handler: Handlers<EditSpaceData, State> = {
  async GET(req, ctx) {
    if (!ctx.state.user) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/login" },
      });
    }

    const spaceId = ctx.params.id;

    const { space, error } = await getSpace(spaceId);
    if (error || !space) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/dashboard/spaces?error=space_not_found" },
      });
    }

    if (space.user_id !== ctx.state.user.id) {
      return new Response(null, {
        status: 303,
        headers: { Location: "/dashboard/spaces?error=unauthorized" },
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
      space,
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

export default function EditSpacePage({ data }: PageProps<EditSpaceData>) {
  const { user, space, categories, tags, accessToken } = data;

  return (
    <DashboardLayout activeSection="spaces" user={user}>
      <div class="max-w-2xl">
        <h1 class="text-2xl font-bold text-gray-900 mb-8">スペースを編集</h1>

        <div class="bg-white border border-gray-200 p-6">
          <SpaceForm
            mode="edit"
            spaceId={space.id}
            initialData={{
              title: space.title,
              description: space.description || undefined,
              category_id: space.category_id || undefined,
              website_url: space.website_url || undefined,
              x_url: space.x_url || undefined,
              instagram_url: space.instagram_url || undefined,
              slug: space.slug || undefined,
              is_public: space.is_public,
            }}
            initialTagIds={space.tags?.map((t) => t.id) || []}
            categories={categories}
            tags={tags}
            accessToken={accessToken}
            isSubscribed={["active", "trialing", "forever_free"].includes(
              space.subscription_status || "",
            )}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
