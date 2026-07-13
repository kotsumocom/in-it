# in-it Icons Reference

## Usage

```tsx
import { Icon } from "@kotsumo/in-it/icons";

<Icon name="settings" size={20} />
<Icon name="heart" size={24} filled />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `name` | `string` | — | Icon name (kebab-case) |
| `size` | `number` | `24` | Width and height in px |
| `filled` | `boolean` | `false` | Use filled variant |
| `class` | `string` | — | Additional CSS class |

## Commonly Used Icons

### Navigation
`home`, `menu`, `arrow-left`, `arrow-right`, `chevron-down`, `chevron-up`, `x`

### Actions
`plus`, `edit`, `trash`, `download`, `upload`, `search`, `filter`, `refresh`

### Status
`check`, `x`, `alert-triangle`, `info-circle`, `circle-check`

### Content
`file`, `folder`, `image`, `link`, `code`, `book`

### User
`user`, `users`, `user-plus`, `user-minus`, `logout`, `login`

### Commerce
`credit-card`, `shopping-cart`, `receipt`, `coin`

### Communication
`bell`, `bell-off`, `mail`, `message`, `send`

### Dashboard
`layout-dashboard`, `chart-bar`, `chart-line`, `chart-pie`, `trending-up`

### Settings
`settings`, `sliders`, `tool`, `database`, `server`, `shield-check`

### Social
`brand-github`, `brand-google`, `brand-twitter`, `share`, `heart`

### Misc
`rocket`, `puzzle`, `palette`, `device-desktop`, `cloud`, `lock`, `key`, `eye`, `eye-off`

## Individual Import (Tree-shaking)

```tsx
import { iconSettings, iconUser } from "@kotsumo/in-it/icons/individual";
```

## Full Icon List

All icons are derived from [Tabler Icons](https://tabler.io/icons) (MIT License).
Use any Tabler icon name in kebab-case format.
