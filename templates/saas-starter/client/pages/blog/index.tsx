/**
 * Blog index page — displays a grid of blog posts.
 *
 * Posts are fetched from your headless CMS. See cms.ts for integration examples.
 */
import { BlogCard, BlogGrid } from "~/components.ts";
import type { BlogPost } from "@kotsumo/in-it/components";
import { Link } from "@kotsumo/in-it/router";

// TODO: Replace with your CMS fetch function
// import { fetchPosts } from "./cms.ts";

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
  {
    slug: "custom-themes",
    title: "Creating Custom Themes with HCT Colors",
    excerpt: "Use the HCT color system to generate beautiful, accessible color schemes for your brand.",
    coverImage: "https://picsum.photos/seed/post3/600/300",
    author: { name: "John Doe" },
    publishedAt: "Jul 5, 2024",
    tags: ["Design", "Theming"],
  },
  {
    slug: "deploying-to-deno-deploy",
    title: "Deploy Your SaaS to Deno Deploy",
    excerpt: "Step-by-step guide to deploying your in-it application to Deno Deploy with CI/CD.",
    coverImage: "https://picsum.photos/seed/post4/600/300",
    author: { name: "Jane Smith" },
    publishedAt: "Jul 1, 2024",
    tags: ["DevOps", "Deployment"],
  },
];

export function BlogIndexPage() {
  // TODO: Replace with dynamic fetch
  // const posts = await fetchPosts();
  const posts = SAMPLE_POSTS;

  return (
    <div class="ii-blog-article" style={{ maxWidth: "960px" }}>
      <div class="ii-admin-page__header">
        <div class="ii-admin-page__header-left">
          <h1 class="ii-admin-page__title">Blog</h1>
          <p class="ii-admin-page__desc">Latest news, tutorials, and updates.</p>
        </div>
      </div>
      <BlogGrid>
        {posts.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </BlogGrid>
    </div>
  );
}
