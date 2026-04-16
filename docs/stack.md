# BAD Platform Tech Stack

## Core
| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js | 16.2.4 |
| Runtime | React | 19.2.4 |
| Language | TypeScript | 5.x |
| Styling | Tailwind CSS | 4.x |
| Database | Supabase (PostgreSQL) | - |
| Auth | Supabase Auth | - |

## Libraries
| Package | Purpose |
|---------|---------|
| @supabase/ssr | Server-side Supabase client |
| @supabase/supabase-js | Supabase JavaScript client |
| recharts | Dashboard charts |
| react-hook-form | Form management |
| zod | Schema validation |

## Infrastructure
- **Hosting**: Vercel (planned)
- **Database**: Supabase Cloud (hvjqebwijuzbxnlhrauc)
- **Auth**: Supabase Auth with email/password
- **CDN**: Vercel Edge Network

## Design System
- Dark theme: zinc-950 background, zinc-900 cards, zinc-800 borders
- Accent: indigo-500
- Font: Geist Sans + Geist Mono
- Component library: Custom Tailwind components in `src/components/ui/`
