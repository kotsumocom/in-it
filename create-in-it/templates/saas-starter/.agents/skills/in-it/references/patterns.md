# in-it Common Patterns

## Admin Page Pattern

Every admin page follows this structure:

```tsx
import { Button } from "~/components.ts";
import { Icon } from "@kotsumo/in-it/icons";

export function MyAdminPage() {
  return (
    <>
      {/* Page header */}
      <div class="ii-admin-page__header">
        <div class="ii-admin-page__header-left">
          <h2 class="ii-admin-page__title">Page Title</h2>
          <p class="ii-admin-page__desc">Description text.</p>
        </div>
        <div class="ii-admin-page__actions">
          <Button variant="filled">
            <Icon name="plus" size={16} /> Action
          </Button>
        </div>
      </div>

      {/* Page content */}
      ...
    </>
  );
}
```

## Dashboard with Charts

```tsx
import { StatCard, BarChart, DonutChart, SparkLine } from "~/components.ts";

// Stats row
<div class="ii-stat-grid">
  <StatCard label="Users" value="1,234" trend="+12%">
    <SparkLine data={[800, 920, 1050, 1234]} variant="success" />
  </StatCard>
</div>

// Chart in a card
<div class="ii-card">
  <div class="ii-card__body">
    <h3 class="ii-admin-page__title">Revenue</h3>
    <BarChart data={[100, 200, 300]} labels={["A", "B", "C"]} />
  </div>
</div>
```

## Settings Page Pattern

```tsx
import { SettingsSection, Switch, Button } from "~/components.ts";

<SettingsSection title="Section" description="Description.">
  {/* Row with label + control */}
  <div class="ii-settings-section__row">
    <span>Label</span>
    <Switch label="Toggle" />
  </div>

  {/* Input field */}
  <div class="ii-input-field">
    <label class="ii-input-field__label" for="field-id">Label</label>
    <input id="field-id" type="text" class="ii-input" />
  </div>

  {/* Save button */}
  <div>
    <Button variant="filled">Save</Button>
  </div>
</SettingsSection>
```

## Adding a New Admin Page

1. Create `client/pages/admin/my-page.tsx`
2. Import from `~/components.ts`
3. Use the admin page pattern above
4. Add route in `client/pages/admin/dashboard.tsx`:

```tsx
// In NAV array:
{ icon: (<Icon name="my-icon" size={20} /> as any), label: "My Page", href: "/admin/my-page" },

// In Switch:
<Route path="/admin/my-page" component={MyPage} />
```

## Adding a Landing Section

```tsx
import { LandingSection } from "~/components.ts";

<LandingSection title="Section Title" subtitle="Optional subtitle.">
  {/* Section content */}
</LandingSection>
```

## Blog Integration

1. Choose a CMS provider (see `client/pages/blog/cms.ts`)
2. Uncomment the provider code and add your credentials
3. Replace `SAMPLE_POSTS` in blog pages with CMS fetch calls

```tsx
import { fetchPosts } from "./cms.ts";
const posts = await fetchPosts();
```

## Component Override

To replace any in-it component:

1. Create your version in `client/overrides/`:
   ```tsx
   // client/overrides/Button.tsx
   import { Button as Base } from "@kotsumo/in-it/components";
   
   export function Button(props: any) {
     return <Base {...props} class={`${props.class ?? ""} my-custom-class`} />;
   }
   ```

2. Update `client/components.ts`:
   ```tsx
   export { Button } from "./overrides/Button.tsx";
   // Everything else from in-it
   export { Card, Badge, Dialog, /* ... */ } from "@kotsumo/in-it/components";
   ```

## Adding Custom CSS

Create a CSS file and import it in `main.tsx`:

```css
/* client/custom.css */
.ii-btn--filled {
  --ii-btn-bg: #2563eb;
}
```

```tsx
// client/main.tsx
import "@kotsumo/in-it/css/main.css";
import "./custom.css";  // After in-it CSS
```
