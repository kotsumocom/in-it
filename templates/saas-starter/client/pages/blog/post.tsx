/**
 * Blog detail page — renders a single blog post.
 *
 * In production, fetch the post from your CMS by slug.
 */
import { BlogArticle } from "~/components.ts";
import type { BlogPost } from "@kotsumo/in-it/components";

// TODO: Replace with your CMS fetch
// import { fetchPostBySlug } from "./cms.ts";

const SAMPLE_POST: BlogPost = {
  slug: "getting-started",
  title: "Getting Started with in-it",
  excerpt: "Learn how to set up your SaaS project.",
  coverImage: "https://picsum.photos/seed/post1/800/400",
  author: { name: "John Doe" },
  publishedAt: "Jul 10, 2024",
  tags: ["Tutorial", "Getting Started"],
  content: "",
};

export function BlogPostPage({ slug }: { slug: string }) {
  // TODO: const post = await fetchPostBySlug(slug);
  const post = SAMPLE_POST;

  return (
    <BlogArticle post={post}>
      <p>
        Welcome to the in-it getting started guide. This framework provides everything
        you need to build a modern SaaS application with minimal setup.
      </p>
      <h2>Installation</h2>
      <pre><code>deno add @kotsumo/in-it</code></pre>
      <h2>Quick Start</h2>
      <p>
        The easiest way to get started is to use the <code>create-in-it</code> CLI tool,
        which sets up a complete project with routing, authentication, and an admin dashboard.
      </p>
      <h2>Components</h2>
      <p>
        in-it includes 50+ pre-built components following Material Design 3 guidelines.
        All components support dark mode and are fully accessible with WAI-ARIA compliance.
      </p>
      <h2>Next Steps</h2>
      <ul>
        <li>Explore the component library in the docs</li>
        <li>Set up authentication with your preferred provider</li>
        <li>Customize the theme with HCT color system</li>
        <li>Deploy to Deno Deploy or your preferred host</li>
      </ul>
    </BlogArticle>
  );
}
