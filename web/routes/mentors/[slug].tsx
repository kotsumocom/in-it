import { Handlers, PageProps } from "$fresh/server.ts";
import { supabase } from "@in-it/backend/supabase.ts";
import { State } from "../_middleware.ts";

interface ExternalLink {
  type: string;
  url: string;
  label: string;
}

interface MentorProfile {
  id: string;
  display_name: string;
  tagline: string | null;
  bio: string | null;
  avatar_url: string | null;
  external_links: ExternalLink[];
  verification_status: string;
  category: {
    display_name: string;
  } | null;
}

interface MentorPageData {
  mentor: MentorProfile | null;
  user: State["user"];
}

export const handler: Handlers<MentorPageData, State> = {
  async GET(_req, ctx) {
    const { slug } = ctx.params;

    const { data: mentor } = await supabase
      .from("mentor_profiles")
      .select(
        `
        id,
        display_name,
        tagline,
        bio,
        avatar_url,
        external_links,
        verification_status,
        category:categories(display_name)
      `
      )
      .eq("slug", slug)
      .eq("is_public", true)
      .single();

    if (!mentor) {
      return ctx.renderNotFound();
    }

    return ctx.render({
      mentor: mentor as MentorProfile,
      user: ctx.state.user,
    });
  },
};

export default function MentorProfile({ data }: PageProps<MentorPageData>) {
  const { mentor, user } = data;

  if (!mentor) {
    return <div>メンターが見つかりません</div>;
  }

  const getVerificationBadge = (status: string) => {
    switch (status) {
      case "identity_verified":
        return (
          <span class="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-sm">
            ✓ 本人確認済み
          </span>
        );
      case "pro":
        return (
          <span class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-sm">
            ⭐ PRO
          </span>
        );
      default:
        return null;
    }
  };

  const getLinkIcon = (type: string) => {
    switch (type) {
      case "calendly":
      case "booking":
        return "📅";
      case "twitter":
      case "x":
        return "𝕏";
      case "instagram":
        return "📷";
      case "youtube":
        return "▶️";
      case "website":
        return "🌐";
      case "zoom":
        return "💬";
      default:
        return "🔗";
    }
  };

  return (
    <div class="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header class="bg-white border-b border-gray-200">
        <div class="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" class="text-xl font-bold text-blue-600">
            in-it
          </a>
          <nav class="flex items-center gap-4">
            <a href="/mentors" class="text-gray-600 hover:text-gray-900">
              メンター一覧
            </a>
            {user ? (
              <a
                href="/dashboard"
                class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                マイページ
              </a>
            ) : (
              <a
                href="/login"
                class="px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                ログイン
              </a>
            )}
          </nav>
        </div>
      </header>

      <div class="max-w-3xl mx-auto py-12 px-4">
        {/* プロフィールヘッダー */}
        <section class="mb-8 p-8 bg-white border border-gray-200">
          <div class="flex flex-col md:flex-row items-start gap-6">
            {mentor.avatar_url ? (
              <img
                src={mentor.avatar_url}
                alt={mentor.display_name}
                class="w-24 h-24 md:w-32 md:h-32 object-cover"
              />
            ) : (
              <div class="w-24 h-24 md:w-32 md:h-32 bg-gray-200 flex items-center justify-center text-4xl">
                👤
              </div>
            )}
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-2xl md:text-3xl font-bold text-gray-900">
                  {mentor.display_name}
                </h1>
                {getVerificationBadge(mentor.verification_status)}
              </div>
              {mentor.category && (
                <p class="text-blue-600 mb-2">{mentor.category.display_name}</p>
              )}
              {mentor.tagline && (
                <p class="text-lg text-gray-700">{mentor.tagline}</p>
              )}
            </div>
          </div>
        </section>

        {/* 外部リンク（CTA） */}
        {mentor.external_links && mentor.external_links.length > 0 && (
          <section class="mb-8">
            <h2 class="text-lg font-bold text-gray-900 mb-4">📌 リンク</h2>
            <div class="flex flex-wrap gap-3">
              {mentor.external_links.map((link) => (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all"
                >
                  <span>{getLinkIcon(link.type)}</span>
                  <span>{link.label}</span>
                </a>
              ))}
            </div>
          </section>
        )}

        {/* 自己紹介 */}
        {mentor.bio && (
          <section class="p-6 bg-white border border-gray-200">
            <h2 class="text-lg font-bold text-gray-900 mb-4">📝 自己紹介</h2>
            <div class="text-gray-700 whitespace-pre-wrap">{mentor.bio}</div>
          </section>
        )}
      </div>
    </div>
  );
}
