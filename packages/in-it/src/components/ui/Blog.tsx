/**
 * BlogCard — Blog post card for listing pages.
 */

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
              <span key={tag} class="ii-chip ii-chip--sm">{tag}</span>
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
  return (
    <article class="ii-blog-article">
      <header class="ii-blog-article__header">
        {post.tags && post.tags.length > 0 && (
          <div class="ii-blog-card__tags">
            {post.tags.map(tag => (
              <span key={tag} class="ii-chip ii-chip--sm">{tag}</span>
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
