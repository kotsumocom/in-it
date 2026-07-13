# in-it CSS Classes Reference

## Foundation

### Variables (`--ii-*`)

| Variable | Light | Dark |
|----------|-------|------|
| `--ii-primary` | `#6750a4` | `#d0bcff` |
| `--ii-primary-container` | `#eaddff` | `#4f378b` |
| `--ii-on-primary` | `#ffffff` | `#381e72` |
| `--ii-surface` | `#fef7ff` | `#141218` |
| `--ii-surface-container` | `#f3edf7` | `#211f26` |
| `--ii-on-surface` | `#1d1b20` | `#e6e0e9` |
| `--ii-outline-variant` | `#cac4d0` | `#49454f` |
| `--ii-error` | `#b3261e` | `#f2b8b5` |
| `--ii-success` | `#0d652d` | `#7dd99a` |
| `--ii-info` | `#0b57d0` | `#a8c7fa` |
| `--ii-warning` | `#e37400` | `#ffb872` |
| `--ii-shape-sm` | `8px` | |
| `--ii-shape-md` | `12px` | |
| `--ii-shape-lg` | `16px` | |
| `--ii-spacing-1..6` | `4px..24px` | |
| `--ii-shadow-sm/md/lg` | Various | |
| `--ii-transition` | `200ms ease` | |

## Common Patterns

### Admin Page

```html
<div class="ii-admin-page__header">
  <div class="ii-admin-page__header-left">
    <h2 class="ii-admin-page__title">Title</h2>
    <p class="ii-admin-page__desc">Description</p>
  </div>
  <div class="ii-admin-page__actions">
    <button class="ii-btn ii-btn--filled">Action</button>
  </div>
</div>

<div class="ii-stat-grid">
  <!-- StatCard components -->
</div>
```

### Settings Page

```html
<div class="ii-settings-section">
  <div>
    <h3 class="ii-settings-section__title">Section</h3>
    <p class="ii-settings-section__desc">Description</p>
  </div>
  <div class="ii-settings-section__content">
    <div class="ii-settings-section__row">
      <span>Label</span>
      <!-- Control (switch, toggle, etc.) -->
    </div>
  </div>
</div>
```

### Auth Page

```html
<div class="ii-auth-page">
  <a class="ii-auth-page__brand" href="/">Brand</a>
  <!-- AuthForm component -->
</div>
```

### Legal Page

```html
<div class="ii-legal-page">
  <h1>Title</h1>
  <p class="ii-legal-page__date">Last updated: ...</p>
  <h2>Section</h2>
  <p>Content</p>
</div>
```

### Notification List

```html
<div class="ii-notification-list">
  <div class="ii-notification-item ii-notification-item--unread">
    <div class="ii-notification-item__icon">...</div>
    <div class="ii-notification-item__content">
      <div class="ii-notification-item__title">Title</div>
      <div class="ii-notification-item__body">Body</div>
      <div class="ii-notification-item__time">Time</div>
    </div>
    <div class="ii-notification-item__dot"></div>
  </div>
</div>
```

### Blog

```html
<div class="ii-blog-grid">
  <div class="ii-blog-card">
    <img class="ii-blog-card__image" src="..." />
    <div class="ii-blog-card__body">
      <div class="ii-blog-card__tags">...</div>
      <h3 class="ii-blog-card__title"><a href="...">Title</a></h3>
      <p class="ii-blog-card__excerpt">Excerpt</p>
      <div class="ii-blog-card__meta">
        <img class="ii-blog-card__author-avatar" src="..." />
        Author · Date
      </div>
    </div>
  </div>
</div>
```

### Placeholder

```html
<div class="ii-placeholder">
  <div class="ii-placeholder__icon">...</div>
  <p class="ii-placeholder__text">Main text</p>
  <p class="ii-placeholder__sub">Subtext</p>
</div>
```
