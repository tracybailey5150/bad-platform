# BAD Platform Architecture

## Overview
BAD Platform is a multi-tenant business automation platform built with Next.js 16 (App Router), Supabase, and Tailwind CSS.

## Architecture Layers

### Frontend (Client)
- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4 (dark theme, zinc/indigo palette)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod (planned)
- **State**: React useState/useEffect with API fetch pattern

### Backend (API)
- **Route Handlers**: Next.js API routes under `src/app/api/`
- **Auth Proxy**: `src/proxy.ts` handles auth redirects
- **Database**: Supabase PostgreSQL via service role client for API routes, anon client for auth

### Data Layer
- **Supabase**: PostgreSQL with RLS policies
- **Three client types**:
  - `client.ts` — browser client (auth, real-time)
  - `server.ts` — server component client (reads)
  - `admin.ts` — service role client (API routes, bypasses RLS)

## Route Groups
- `(auth)` — login, signup, forgot/reset password
- `(app)` — authenticated app shell with sidebar
- `(public)` — public-facing pages (intake forms)
- `api/` — REST API routes

## Multi-Tenancy
- Every table has `org_id` column
- RLS policies scope data to user's organization
- API routes verify org membership before queries

## File Structure
```
src/
  app/
    (auth)/          # Auth pages
    (app)/           # Protected app pages
    (public)/        # Public pages
    api/             # API routes
  components/
    ui/              # Reusable UI components
    layout/          # App shell components
  lib/
    supabase/        # Supabase client factories
  types/             # TypeScript types
```
