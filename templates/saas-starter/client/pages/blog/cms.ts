/**
 * CMS integration — connects your blog to a headless CMS.
 *
 * Choose your provider and uncomment the relevant section below.
 * Each provider implements the same BlogPost interface.
 */
import type { BlogPost } from "@kotsumo/in-it/components";

// ============================================================
// Option 1: Sanity (Recommended)
// ============================================================
//
// Install:
//   deno add npm:@sanity/client
//
// import { createClient } from "@sanity/client";
//
// const sanity = createClient({
//   projectId: "your-project-id",
//   dataset: "production",
//   apiVersion: "2024-01-01",
//   useCdn: true,
// });
//
// export async function fetchPosts(): Promise<BlogPost[]> {
//   const posts = await sanity.fetch(`
//     *[_type == "post"] | order(publishedAt desc) {
//       "slug": slug.current,
//       title,
//       excerpt,
//       "coverImage": mainImage.asset->url,
//       "author": author-> { name, "avatar": image.asset->url },
//       publishedAt,
//       "tags": categories[]->title
//     }
//   `);
//   return posts.map((p: any) => ({
//     ...p,
//     publishedAt: new Date(p.publishedAt).toLocaleDateString("en-US", {
//       month: "short", day: "numeric", year: "numeric"
//     }),
//   }));
// }
//
// export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
//   const post = await sanity.fetch(`
//     *[_type == "post" && slug.current == $slug][0] {
//       "slug": slug.current,
//       title,
//       excerpt,
//       "coverImage": mainImage.asset->url,
//       "author": author-> { name, "avatar": image.asset->url },
//       publishedAt,
//       "tags": categories[]->title,
//       "content": body
//     }
//   `, { slug });
//   if (!post) return null;
//   return {
//     ...post,
//     publishedAt: new Date(post.publishedAt).toLocaleDateString("en-US", {
//       month: "short", day: "numeric", year: "numeric"
//     }),
//   };
// }

// ============================================================
// Option 2: Contentful
// ============================================================
//
// Install:
//   deno add npm:contentful
//
// import { createClient } from "contentful";
//
// const contentful = createClient({
//   space: "your-space-id",
//   accessToken: "your-access-token",
// });
//
// export async function fetchPosts(): Promise<BlogPost[]> {
//   const entries = await contentful.getEntries({
//     content_type: "blogPost",
//     order: ["-fields.publishedAt"],
//   });
//   return entries.items.map((item: any) => ({
//     slug: item.fields.slug,
//     title: item.fields.title,
//     excerpt: item.fields.excerpt,
//     coverImage: item.fields.coverImage?.fields?.file?.url
//       ? `https:${item.fields.coverImage.fields.file.url}`
//       : undefined,
//     author: {
//       name: item.fields.author?.fields?.name ?? "Unknown",
//       avatar: item.fields.author?.fields?.avatar?.fields?.file?.url
//         ? `https:${item.fields.author.fields.avatar.fields.file.url}`
//         : undefined,
//     },
//     publishedAt: new Date(item.fields.publishedAt).toLocaleDateString("en-US", {
//       month: "short", day: "numeric", year: "numeric"
//     }),
//     tags: item.fields.tags ?? [],
//   }));
// }

// ============================================================
// Default: Static sample data (for development)
// ============================================================

const SAMPLE_POSTS: BlogPost[] = [
  {
    slug: "getting-started",
    title: "Getting Started with in-it",
    excerpt: "Learn how to set up your SaaS project with in-it framework in under 5 minutes.",
    coverImage: "https://picsum.photos/seed/post1/600/300",
    author: { name: "John Doe" },
    publishedAt: "Jul 10, 2024",
    tags: ["Tutorial", "Getting Started"],
  },
  {
    slug: "auth-with-supabase",
    title: "Adding Authentication with Supabase",
    excerpt: "Connect Supabase Auth to the in-it AuthForm component for passwordless and OAuth login.",
    coverImage: "https://picsum.photos/seed/post2/600/300",
    author: { name: "Jane Smith" },
    publishedAt: "Jul 8, 2024",
    tags: ["Auth", "Supabase"],
  },
];

export async function fetchPosts(): Promise<BlogPost[]> {
  return SAMPLE_POSTS;
}

export async function fetchPostBySlug(slug: string): Promise<BlogPost | null> {
  return SAMPLE_POSTS.find(p => p.slug === slug) ?? null;
}
