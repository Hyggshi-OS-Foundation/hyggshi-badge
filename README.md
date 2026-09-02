# Hyggshi Badge ✦

> A stunning, high-performance custom SVG badge generator — a modern, aesthetic alternative to Shields.io.
> Built with **Next.js 15 + TypeScript**, deployed on **Vercel** in one click.

[![Build](https://hyggshi-badge.vercel.app/api/badge?label=build&message=passing&color=22c55e&style=hyggshi&icon=check&shape=cyberpunk)](https://hyggshi-badge.vercel.app)
[![TypeScript](https://hyggshi-badge.vercel.app/api/badge?message=TypeScript&color=3178C6&icon=typescript&style=flat)](https://typescriptlang.org)
[![Vercel](https://hyggshi-badge.vercel.app/api/badge?message=Vercel&icon=vercel&style=flat&color=000)](https://vercel.com)

---

## 🌟 Features

| Feature | Description |
|---|---|
| **5 Themes** | Flat, Glass (glassmorphism), Neon (cyberpunk), Hyggshi (holographic), Custom |
| **6 Shapes** | Rounded, Pill, Square, Cyberpunk cut, Hexagon, Shield |
| **SVG Animations** | Pulse, Glow, Shine sweep, Gradient shift |
| **Badge Studio** | Full visual editor with live preview and 1-click code export |
| **40+ Icons** | React, TypeScript, GitHub, Docker, npm, Discord, and more |
| **API Routes** | Static, GitHub, npm, Dynamic JSON, Custom endpoint |
| **Vercel Edge** | Edge runtime, CDN cache headers, CORS enabled |

---

## 🚀 Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/hyggshi-badge)

---

## 📡 API Reference

### Static Badge
```
GET /api/badge?label=build&message=passing&color=22c55e&style=hyggshi
```

**Parameters:**

| Param | Description | Default |
|---|---|---|
| `label` | Left side text | _(empty)_ |
| `message` | Right side text (**required**) | — |
| `color` | Right background (hex/name) | `#22c55e` |
| `labelColor` | Left background | `#24292f` |
| `style` | `flat` \| `glass` \| `neon` \| `hyggshi` \| `plastic` \| `flat-square` | `flat` |
| `shape` | `rounded` \| `pill` \| `square` \| `cyberpunk` \| `hexagon` \| `shield` | `rounded` |
| `icon` | Icon slug (github, react, docker…) | _(none)_ |
| `iconColor` | Icon fill color | `#ffffff` |
| `animation` | `none` \| `pulse` \| `glow` \| `shine` \| `gradient-shift` | `none` |
| `fontSize` | Text size in px | `11` |
| `height` | Badge height in px | `20` |
| `paddingX` | Horizontal padding | `8` |

### URL Slug Format (Shields.io compatible)
```
GET /api/badge/:label-:message-:color.svg
```
Example: `/api/badge/version-v2.0.0-6366f1.svg?style=neon`

---

### GitHub Badges
```
GET /api/github/stars/:owner/:repo
GET /api/github/forks/:owner/:repo
GET /api/github/issues/:owner/:repo
GET /api/github/license/:owner/:repo
GET /api/github/release/:owner/:repo
GET /api/github/workflow/:owner/:repo/:workflow.yml
GET /api/github/followers/:username
```

### npm Badges
```
GET /api/npm/v/:package          # Latest version
GET /api/npm/dt/:package         # Total downloads
GET /api/npm/dm/:package         # Monthly downloads
GET /api/npm/dw/:package         # Weekly downloads
GET /api/npm/license/:package    # License
```

### Dynamic JSON Badge
```
GET /api/dynamic?url=<JSON_API_URL>&query=$.path.to.value&label=myLabel&style=hyggshi
```

### Custom Endpoint (Shields.io compatible)
Your server returns:
```json
{
  "schemaVersion": 1,
  "label": "downloads",
  "message": "5.2M/mo",
  "color": "22c55e",
  "style": "hyggshi"
}
```
```
GET /api/endpoint?url=https://example.com/badge-status.json
```

### Custom Icon / Logo Upload
Upload your own logo (PNG, SVG, JPG, WebP) and use the returned short ID in your badge URL:
```bash
# Upload via multipart form data:
curl -X POST https://hyggshi-badge.vercel.app/api/icons/upload \
  -F "file=@/path/to/my-logo.png"

# Response:
# { "id": "ico_a1b2c3d4", "mimeType": "image/png", "iconParam": "ico_a1b2c3d4" }

# Use in Badge URL (clean and compact):
# https://hyggshi-badge.vercel.app/api/badge?label=tool&message=ready&icon=ico_a1b2c3d4
```

---

## 🛠 Local Development

```bash
git clone https://github.com/yourusername/hyggshi-badge
cd hyggshi-badge
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Optional: GitHub API rate limits
Create `.env.local`:
```
GITHUB_TOKEN=your_github_personal_access_token
```

---

## 📁 Project Structure

```
hyggshi-badge/
├── app/
│   ├── api/
│   │   ├── badge/          Static & slug badge routes
│   │   ├── icons/          Icon upload & serve routes (short IDs)
│   │   ├── github/         GitHub data badges
│   │   ├── npm/            npm package badges
│   │   ├── dynamic/        Dynamic JSON badge
│   │   └── endpoint/       Custom JSON endpoint
│   ├── globals.css          Design system (Vanilla CSS)
│   ├── studio.css           Studio UI CSS
│   ├── layout.tsx           Root layout
│   └── page.tsx             Badge Studio app
│
├── components/
│   ├── BadgePreview.tsx     Live preview canvas
│   ├── BadgeCustomizer.tsx  4-tab badge editor (Presets, Upload Logo, Image URL)
│   ├── TemplateGallery.tsx  Pre-built templates
│   ├── ApiPlayground.tsx    Interactive API docs
│   └── CodeExportModal.tsx  Export Markdown/HTML/SVG/React
│
├── lib/
│   ├── renderer/
│   │   ├── types.ts         TypeScript interfaces
│   │   ├── text-metrics.ts  Accurate SVG text measurement
│   │   ├── icons.ts         40+ built-in SVG icons
│   │   ├── themes.ts        Theme definitions & shape paths
│   │   ├── svg-engine.ts    Core SVG badge renderer
│   │   └── query-parser.ts  URL query parameter parser
│   └── storage/
│       └── icon-store.ts    Short ID generation, in-memory & disk caching
```

---

## 🎨 Themes Preview

| Theme | Description |
|---|---|
| **Flat** | Clean, modern minimal design |
| **Glass** | Glassmorphism with light refraction |
| **Neon** | Cyberpunk neon glow SVG filter |
| **Hyggshi** | Holographic Aurora gradient with cyber angles |
| **Custom** | Full control — border, radius, gradient, glow |

---

## 📄 License

MIT © Hyggshi
