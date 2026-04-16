# BAD Platform Database Schema

## Pre-existing Tables
These tables were already created in Supabase:

### organizations
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| name | text | |
| slug | text | URL-safe identifier |
| logo_url | text | nullable |
| settings | jsonb | |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### profiles
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK, references auth.users |
| email | text | |
| full_name | text | |
| avatar_url | text | nullable |
| org_id | uuid | FK to organizations |
| role | text | owner, admin, member |
| created_at | timestamptz | |
| updated_at | timestamptz | |

### leads
| Column | Type | Notes |
|--------|------|-------|
| id | uuid | PK |
| org_id | uuid | FK to organizations |
| name | text | |
| email | text | nullable |
| phone | text | nullable |
| company | text | nullable |
| status | text | new, contacted, qualified, won, lost |
| source | text | website, referral, social, cold_outreach, form, other |
| score | integer | |
| assigned_to | uuid | nullable, FK to auth.users |
| notes | text | nullable |
| created_at | timestamptz | |
| updated_at | timestamptz | |

## Sprint 1 New Tables

### forms
Stores intake form definitions with dynamic field configuration.

### form_submissions
Stores submitted form data, linked to forms and leads.

### workflows
Project/task workflow containers.

### workflow_items
Individual tasks within a workflow.

### activity_events
Audit log of all platform events.

### bookings
Calendar bookings with client info.

### quotes
Financial quotes with line items stored as JSONB.

## RLS Strategy
All tables have RLS enabled. Policies scope reads/writes to the user's `org_id` via the profiles table. Public intake forms use service role for submissions.
