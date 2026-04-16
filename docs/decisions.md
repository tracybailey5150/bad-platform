# BAD Platform Technical Decisions

## 1. Three Supabase Clients
**Decision**: Separate browser, server, and admin clients.
**Why**: Browser client handles auth flows. Server client reads session in server components. Admin client (service role) bypasses RLS in API routes for reliable multi-tenant data access.

## 2. API Routes Over Server Actions
**Decision**: Use Next.js Route Handlers for data mutations.
**Why**: Cleaner separation of concerns. API routes can be tested independently, reused by future mobile/external clients, and provide explicit HTTP semantics.

## 3. Proxy (formerly Middleware) for Auth
**Decision**: Use `proxy.ts` to gate protected routes.
**Why**: Centralized auth check. Redirects unauthenticated users to login. Allows public routes (landing, intake forms, API) through.

## 4. JSONB for Form Fields and Quote Items
**Decision**: Store dynamic schemas as JSONB columns.
**Why**: Form fields and quote line items are variable-structure. JSONB avoids excessive join tables while remaining queryable.

## 5. Dark Theme First
**Decision**: All UI uses dark zinc palette with indigo accents.
**Why**: Professional appearance for business tools. Consistent brand identity. Dark themes reduce eye strain for power users.

## 6. Component-Level Client/Server Split
**Decision**: Server components for layout data loading, client components for interactive features.
**Why**: App layout fetches user/org data server-side (fast, no flash). Interactive pages (leads, forms, dashboard) use client components with API fetch for dynamic data.

## 7. Multi-Tenant via org_id
**Decision**: Every data table includes org_id with RLS policies.
**Why**: Clean tenant isolation. Single database, simple deployment. RLS provides defense-in-depth beyond application-level checks.
