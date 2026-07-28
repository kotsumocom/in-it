# Assets

Place static files (images, fonts, etc.) in this directory.

Import them in your components to get cache-busting hashed URLs:

```tsx
import logoUrl from "~/assets/logo.svg";

<img src={logoUrl} alt="Logo" />
```

The bundler will output files like `/assets/logo-abc123.svg` with
content-based hashes, so browsers always fetch the latest version.
