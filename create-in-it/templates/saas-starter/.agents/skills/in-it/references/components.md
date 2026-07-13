# in-it Component Props Reference

## Layout Components

### AdminShell

```tsx
interface AdminShellProps {
  brand: string;                    // Brand name or logo element
  navItems: NavItem[];              // Sidebar navigation items
  currentPath: string;              // Current URL path for active highlighting
  onNavigate: (path: string) => void;
  headerActions?: any;              // Header right-side content (e.g. UserMenu)
  children: any;
}

interface NavItem {
  icon: any;        // JSX element (e.g. <Icon name="..." />)
  label: string;
  href: string;
}
```

### DocsShell

```tsx
interface DocsShellProps {
  brand: string;
  sidebarGroups: DocsSidebarGroup[];
  toc?: DocsTocItem[];
  children: any;
}

interface DocsSidebarGroup {
  label: string;
  items: DocsSidebarItem[];
}

interface DocsSidebarItem {
  label: string;
  href: string;
  active?: boolean;
}

interface DocsTocItem {
  label: string;
  href: string;
  level: number;
}
```

### Landing Components

```tsx
interface LandingHeaderProps {
  brand: string;
  navLinks: { href: string; label: string }[];
  themeToggle?: any;
}

interface LandingHeroProps {
  badge?: string;
  headline: string;
  subhead: string;
  actions?: any;    // JSX elements (buttons)
}

interface LandingFeaturesProps {
  features: FeatureCard[];
}

interface FeatureCard {
  icon: any;
  title: string;
  description: string;
}

interface LandingSectionProps {
  title: string;
  subtitle?: string;
  children: any;
}

interface LandingFooterProps {
  children: any;
}
```

---

## UI Components

### Button

```tsx
interface ButtonProps {
  variant?: "filled" | "outlined" | "text" | "tonal";
  disabled?: boolean;
  class?: string;
  onClick?: () => void;
  children: any;
}
```

### Card

```tsx
interface CardProps {
  class?: string;
  children: any;
}
// Use with: <div class="ii-card__body">, <div class="ii-card__header">, <div class="ii-card__footer">
```

### Badge

```tsx
interface BadgeProps {
  variant?: "default" | "success" | "error" | "warning" | "info";
  children: any;
}
```

### StatCard

```tsx
interface StatCardProps {
  label: string;
  value: string;
  trend?: string;          // e.g. "+12%", "-3%"
  children?: any;          // e.g. SparkLine
}
```

### PricingCard

```tsx
interface PricingCardProps {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
  cta?: string;
  onCtaClick?: () => void;
}
```

### ErrorPage

```tsx
interface ErrorPageProps {
  code: number;            // e.g. 404, 500
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}
```

### SettingsSection

```tsx
interface SettingsSectionProps {
  title: string;
  description: string;
  children: any;
}
```

### DataTable

```tsx
interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
}

interface DataTableColumn<T> {
  key: keyof T;
  label: string;
  render?: (item: T) => any;
}
```

### Blog Components

```tsx
interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  coverImage?: string;
  author: { name: string; avatar?: string };
  publishedAt: string;
  tags?: string[];
  content?: string;
}

interface BlogCardProps {
  post: BlogPost;
  basePath?: string;      // default: "/blog"
}

interface BlogGridProps {
  children: any;
}

interface BlogArticleProps {
  post: BlogPost;
  children: any;           // Article body content
}
```

---

## Interactive Components

### AuthForm

```tsx
interface AuthFormProps {
  mode: "login" | "signup";
  onSubmit: (data: AuthFormData) => void;
  onProviderClick?: (providerId: string) => void;
  onModeSwitch?: () => void;
  providers?: string[];    // e.g. ["google", "github"]
  loading?: boolean;
  error?: string;
}

interface AuthFormData {
  email: string;
  password: string;
  name?: string;           // Only in signup mode
}
```

### UserMenu

```tsx
interface UserMenuProps {
  name: string;
  email?: string;
  avatar?: string;
  items: UserMenuItem[];
}

interface UserMenuItem {
  label?: string;
  icon?: any;
  onClick?: () => void;
  divider?: boolean;
}
```

### Dialog

```tsx
interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: any;
  actions?: any;
}
```

### Tabs

```tsx
interface TabsProps {
  tabs: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  children: any;
}
```

### Select

```tsx
interface SelectProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}
```

### Switch

```tsx
interface SwitchProps {
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}
```

### ThemeToggle

```tsx
interface ThemeToggleProps {
  compact?: boolean;
}
```

---

## Chart Components

### BarChart

```tsx
interface BarChartProps {
  data: number[];
  labels?: string[];
  colors?: string[];
  height?: number;         // default: 200
  showValues?: boolean;    // default: true
}
```

### LineChart

```tsx
interface LineChartProps {
  data: number[];
  labels?: string[];
  height?: number;         // default: 200
  color?: string;
  area?: boolean;          // Fill area under line
  showDots?: boolean;      // default: true
  showGrid?: boolean;      // default: true
}
```

### DonutChart

```tsx
interface DonutChartProps {
  data: DonutSegment[];
  size?: number;           // default: 160
  thickness?: number;      // default: 24
  centerValue?: string;
  centerLabel?: string;
  showLegend?: boolean;    // default: true
}

interface DonutSegment {
  label: string;
  value: number;
  color?: string;
}
```

### SparkLine

```tsx
interface SparkLineProps {
  data: number[];
  width?: number;          // default: 80
  height?: number;         // default: 24
  color?: string;
  variant?: "default" | "success" | "error";
}
```

---

## Icons

```tsx
interface IconProps {
  name: string;            // Tabler icon name (kebab-case)
  size?: number;           // default: 24
  class?: string;
  filled?: boolean;        // Use filled variant
}

// Usage: <Icon name="settings" size={20} />
```
