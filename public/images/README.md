# Images

Drop image files here (`.jpg`, `.png`, `.webp`, `.svg`). Anything in this folder is served as a static
file at `/images/<filename>` — e.g. `public/images/hero.jpg` is reachable at `/images/hero.jpg`.

Use them in components with Next's `Image` component for automatic optimization:

```tsx
import Image from 'next/image'

<Image src="/images/hero.jpg" alt="..." width={1200} height={800} />
```

Prefer `.webp` where possible for smaller file sizes, and keep filenames lowercase with hyphens
(e.g. `protocol-bpc-157.jpg`).
