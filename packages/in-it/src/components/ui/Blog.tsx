import { injectCSS } from "../../inject.ts";
import { Chip } from "./mod.tsx";

/** @internal CSS for Blog and Notifications — co-located for self-containment. */
export const BLOG_NOTIFICATIONS_CSS = `/* --- Notification Item --- */
.ii-notification-list {
  display: flex;
  flex-direction: column;
}
.ii-notification-item {
  display: flex;
  gap: var(--ii-spacing-3);
  padding: var(--ii-spacing-4);
  border-bottom: 1px solid var(--ii-outline-variant);
  transition: background var(--ii-transition);
}
.ii-notification-item:last-child {
  border-bottom: none;
}
.ii-notification-item:hover {
  background: var(--ii-surface-container);
}
.ii-notification-item--unread {
  background: color-mix(in srgb, var(--ii-primary) 5%, transparent);
}
.ii-notification-item__icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--ii-surface-container-high);
  color: var(--ii-primary);
}
.ii-notification-item__content {
  flex: 1;
  min-width: 0;
}
.ii-notification-item__title {
  font-size: var(--ii-font-base);
  font-weight: 500;
  color: var(--ii-on-surface);
  margin-bottom: 2px;
}
.ii-notification-item__body {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
  margin-bottom: 4px;
}
.ii-notification-item__time {
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
  opacity: 0.7;
}
.ii-notification-item__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ii-primary);
  flex-shrink: 0;
  margin-top: 6px;
}

/* Blog components */
.ii-blog-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--ii-spacing-6);
}
.ii-blog-card {
  border: 1px solid var(--ii-outline-variant);
  border-radius: var(--ii-shape-lg);
  overflow: hidden;
  transition: box-shadow var(--ii-transition);
  background: var(--ii-surface);
}
.ii-blog-card:hover {
  box-shadow: var(--ii-shadow-md);
}
.ii-blog-card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  background: var(--ii-surface-container);
}
.ii-blog-card__body {
  padding: var(--ii-spacing-4);
}
.ii-blog-card__tags {
  display: flex;
  gap: var(--ii-spacing-1);
  margin-bottom: var(--ii-spacing-2);
}
.ii-blog-card__title {
  font-size: var(--ii-font-lg);
  font-weight: 600;
  color: var(--ii-on-surface);
  margin: 0 0 var(--ii-spacing-2);
}
.ii-blog-card__title a {
  text-decoration: none;
  color: inherit;
}
.ii-blog-card__title a:hover {
  color: var(--ii-primary);
}
.ii-blog-card__excerpt {
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface-variant);
  margin: 0 0 var(--ii-spacing-3);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.ii-blog-card__meta {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-2);
  font-size: var(--ii-font-sm);
  color: var(--ii-on-surface-variant);
}
.ii-blog-card__author-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  object-fit: cover;
}

/* Blog layout (article detail) */
.ii-blog-article {
  max-width: 720px;
  margin: 0 auto;
  padding: 60px var(--ii-spacing-6);
}
.ii-blog-article__header {
  margin-bottom: var(--ii-spacing-6);
}
.ii-blog-article__title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 var(--ii-spacing-3);
}
.ii-blog-article__meta {
  display: flex;
  align-items: center;
  gap: var(--ii-spacing-3);
  font-size: var(--ii-font-base);
  color: var(--ii-on-surface-variant);
}
.ii-blog-article__cover {
  width: 100%;
  border-radius: var(--ii-shape-lg);
  margin-bottom: var(--ii-spacing-6);
}
`;

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  author: { name: string; avatar?: string };
  publishedAt: string;
  tags?: string[];
  content?: string;
}

export interface BlogCardProps {
  post: BlogPost;
  basePath?: string;
}

export function BlogCard({ post, basePath = "/blog" }: BlogCardProps): any {
  injectCSS("ii-blog", BLOG_NOTIFICATIONS_CSS);
  return (
    <div class="ii-blog-card">
      {post.coverImage && (
        <img class="ii-blog-card__image" src={post.coverImage} alt={post.title} loading="lazy" />
      )}
      {!post.coverImage && <div class="ii-blog-card__image" />}
      <div class="ii-blog-card__body">
        {post.tags && post.tags.length > 0 && (
          <div class="ii-blog-card__tags">
            {post.tags.map(tag => (
              <Chip key={tag} size="sm">{tag}</Chip>
            ))}
          </div>
        )}
        <h3 class="ii-blog-card__title">
          <a href={`${basePath}/${post.slug}`}>{post.title}</a>
        </h3>
        <p class="ii-blog-card__excerpt">{post.excerpt}</p>
        <div class="ii-blog-card__meta">
          {post.author.avatar && (
            <img class="ii-blog-card__author-avatar" src={post.author.avatar} alt={post.author.name} />
          )}
          <span>{post.author.name}</span>
          <span>·</span>
          <span>{post.publishedAt}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * BlogGrid — Grid layout for blog cards.
 */
export interface BlogGridProps {
  children: any;
}

export function BlogGrid({ children }: BlogGridProps): any {
  injectCSS("ii-blog", BLOG_NOTIFICATIONS_CSS);
  return <div class="ii-blog-grid">{children}</div>;
}

/**
 * BlogArticle — Article detail layout.
 */
export interface BlogArticleProps {
  post: BlogPost;
  children: any;
}

export function BlogArticle({ post, children }: BlogArticleProps): any {
  injectCSS("ii-blog", BLOG_NOTIFICATIONS_CSS);
  return (
    <article class="ii-blog-article">
      <header class="ii-blog-article__header">
        {post.tags && post.tags.length > 0 && (
          <div class="ii-blog-card__tags">
            {post.tags.map(tag => (
              <Chip key={tag} size="sm">{tag}</Chip>
            ))}
          </div>
        )}
        <h1 class="ii-blog-article__title">{post.title}</h1>
        <div class="ii-blog-article__meta">
          {post.author.avatar && (
            <img class="ii-blog-card__author-avatar" src={post.author.avatar} alt={post.author.name} />
          )}
          <span>{post.author.name}</span>
          <span>·</span>
          <span>{post.publishedAt}</span>
        </div>
      </header>
      {post.coverImage && (
        <img class="ii-blog-article__cover" src={post.coverImage} alt={post.title} />
      )}
      <div class="markdown-body">{children}</div>
    </article>
  );
}
