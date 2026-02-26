# TCG Platform — Claude Code Master Build Instructions

> This file is the single source of truth for Claude Code to build, maintain, test, and extend the TCG (Tech Consulting Group @ UT Austin) platform.
> When in doubt, refer back to this file. Follow the Build Order (Section 11) on first build.

---

## 0. Project Overview

**What we are building:** A full-stack internal operations platform for TCG:
1. **CRM / Outreach Dashboard** — track people and companies reached out to
2. **Apollo.io Integration** — pull contact/company data directly into the CRM
3. **Gmail Integration** — connect Gmail, compose emails, schedule sends
4. **Universal Search** — search all contacts, companies, outreach, emails
5. **TCG Hub** (future) — platform for all TCG-related content

**Existing repos (audit before use):**
- `https://github.com/utexas-tcg/TCG` — old React frontend
- `https://github.com/utexas-tcg/TCG-project-db` — old Python backend

---

## 1. Design System & Brand Identity

### Color Palette (matches texastcg.com — white and blue)

```css
/* Primary Blues */
--tcg-blue-900:    #0a1628;   /* darkest — sidebar background */
--tcg-blue-800:    #0f2044;   /* dark — sidebar hover */
--tcg-blue-700:    #1a3a6b;   /* medium — nav elements */
--tcg-blue-600:    #1e4d8c;   /* core TCG blue — primary buttons */
--tcg-blue-500:    #2563eb;   /* bright — links, active states */
--tcg-blue-400:    #3b82f6;   /* lighter — hover states */
--tcg-blue-100:    #dbeafe;   /* pale — subtle backgrounds */
--tcg-blue-50:     #eff6ff;   /* near-white — page backgrounds */

/* Neutrals */
--tcg-white:       #ffffff;   /* main content backgrounds */
--tcg-gray-50:     #f8fafc;   /* card backgrounds */
--tcg-gray-100:    #f1f5f9;   /* dividers */
--tcg-gray-400:    #94a3b8;   /* placeholder text */
--tcg-gray-600:    #475569;   /* secondary text */
--tcg-gray-900:    #0f172a;   /* primary text */

/* Accents */
--tcg-gold:        #f59e0b;   /* highlights, badges */
--tcg-green:       #10b981;   /* success */
--tcg-red:         #ef4444;   /* errors, rejected */

/* Gradients */
--tcg-gradient-hero:    linear-gradient(135deg, #0a1628 0%, #1a3a6b 50%, #2563eb 100%);
--tcg-gradient-sidebar: linear-gradient(180deg, #0a1628 0%, #0f2044 100%);
--tcg-gradient-card:    linear-gradient(145deg, #ffffff 0%, #eff6ff 100%);
```

### Tailwind Config (`tailwind.config.ts`)
```typescript
import type { Config } from 'tailwindcss'
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        tcg: {
          'blue-900': '#0a1628', 'blue-800': '#0f2044', 'blue-700': '#1a3a6b',
          'blue-600': '#1e4d8c', 'blue-500': '#2563eb', 'blue-400': '#3b82f6',
          'blue-100': '#dbeafe', 'blue-50':  '#eff6ff',
          'gold': '#f59e0b', 'green': '#10b981', 'red': '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Cal Sans', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'tcg-hero':    'linear-gradient(135deg, #0a1628 0%, #1a3a6b 50%, #2563eb 100%)',
        'tcg-sidebar': 'linear-gradient(180deg, #0a1628 0%, #0f2044 100%)',
      },
      boxShadow: {
        'tcg-card':  '0 4px 24px rgba(37, 99, 235, 0.08)',
        'tcg-float': '0 8px 32px rgba(10, 22, 40, 0.16)',
      },
    },
  },
  plugins: [],
}
export default config
```

### Layout Rules
- **Sidebar:** `bg-tcg-sidebar` gradient, white text, blue-400 active indicators
- **Main content:** `bg-tcg-blue-50` base, white cards with `shadow-tcg-card`
- **Top nav:** white, subtle bottom border, blue-600 primary actions
- **Cards:** `bg-white rounded-xl shadow-tcg-card border border-tcg-blue-100`
- **Buttons Primary:** `bg-tcg-blue-600 hover:bg-tcg-blue-500 text-white`
- **Buttons Secondary:** `border border-tcg-blue-500 text-tcg-blue-600`
- Feel: clean, airy, professional — white-space heavy, blue as the focal color

---

## 2. React Bits Integration

**React Bits** (reactbits.dev) — 110+ animated, interactive React components. Use for all motion, delight, and visual polish. MIT licensed, copy-paste + CLI ready.

### Installation
```bash
npm install framer-motion   # core animation engine React Bits uses
npm install @react-spring/web  # spring physics (some components)

# Install individual components via CLI (TypeScript + Tailwind variant):
npx shadcn@latest add https://reactbits.dev/r/<ComponentName>-TS-TW

# All React Bits components go in: frontend/src/components/ReactBits/
```

### Component Map (what to use where)

| Page / Feature | React Bits Component | Effect |
|---|---|---|
| Login page hero | `Aurora` or `Rising Lines` | Animated background |
| Dashboard headings | `BlurText` | Words blur-fade in |
| Dashboard stats | `AnimatedCounter` | Numbers count up on load |
| Contact/company lists | `AnimatedList` | Staggered row entrance |
| Search input focus | `Blur Highlight` | Glow on focus |
| Sidebar nav items | `Magnetic` | Subtle magnetic hover pull |
| Page route changes | `FadeIn` wrapper | Smooth page transitions |
| Kanban outreach cards | `Depth Card` | 3D hover lift |
| Email template hover | `Hover Preview` | Floating preview card |
| Initial app load | `Preloader` | TCG-branded loading screen |
| CTA / hero text | `SplitText` | Split + animate words |
| Notifications | `AnimatedList` | Slide-in toasts |

### Color Override Rule
When React Bits components accept color props, always override to TCG palette:
- Primary: `#2563eb` (tcg-blue-500)
- Secondary: `#0a1628` (tcg-blue-900)
- Accent: `#f59e0b` (tcg-gold)
- Background: `#eff6ff` (tcg-blue-50)

### Usage Pattern
```tsx
// 1. Install: npx shadcn@latest add https://reactbits.dev/r/BlurText-TS-TW
// 2. Import from components/ReactBits/
import BlurText from '@/components/ReactBits/BlurText'

export function PageTitle({ text }: { text: string }) {
  return (
    <BlurText
      text={text}
      delay={150}
      animateBy="words"
      direction="top"
      className="text-3xl font-display font-bold text-tcg-gray-900"
    />
  )
}
```

---

## 3. Tech Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 14 (App Router), TypeScript |
| Styling | Tailwind CSS + shadcn/ui + React Bits |
| Animations | Framer Motion + React Spring (via React Bits) |
| State | Zustand (client) + TanStack Query (server) |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table v8 |
| Rich Text | Tiptap editor |
| Command Palette | cmdk |
| Backend | FastAPI (Python 3.11+) |
| ORM | SQLAlchemy 2.0 async + Alembic |
| Auth | Supabase Auth (Google OAuth → Gmail) |
| Queue | Celery + Redis |
| Database | Supabase (PostgreSQL) |
| Cache | Redis |
| Deploy | Vercel (frontend) + Railway (backend + Redis) |
| CI/CD | GitHub Actions |

---

## 4. Repository Structure

```
tcg-platform/
├── CLAUDE.md
├── README.md
├── docker-compose.yml
├── .github/workflows/
│   ├── ci.yml
│   └── deploy.yml
│
├── .claude/                         ← Claude Code configuration
│   ├── agents/                      ← Specialist subagents (auto-invoked)
│   │   ├── frontend-designer.md
│   │   ├── backend-engineer.md
│   │   ├── db-architect.md
│   │   ├── test-writer.md
│   │   ├── bug-fixer.md
│   │   └── api-integrator.md
│   └── commands/                    ← Custom slash commands
│       ├── build-phase.md
│       ├── fix-bug.md
│       ├── write-tests.md
│       ├── add-animation.md
│       ├── new-page.md
│       ├── new-api-route.md
│       ├── db-migrate.md
│       └── deploy-check.md
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/login/
│       │   ├── (auth)/callback/
│       │   └── (dashboard)/
│       │       ├── layout.tsx
│       │       ├── page.tsx            ← Dashboard home
│       │       ├── contacts/
│       │       ├── companies/
│       │       ├── outreach/
│       │       ├── emails/
│       │       ├── search/
│       │       └── settings/
│       ├── components/
│       │   ├── ui/                     ← shadcn/ui
│       │   ├── ReactBits/              ← All React Bits components
│       │   ├── layout/
│       │   │   ├── Sidebar.tsx
│       │   │   ├── TopNav.tsx
│       │   │   └── SearchBar.tsx
│       │   ├── contacts/
│       │   ├── outreach/
│       │   ├── emails/
│       │   └── apollo/
│       ├── lib/api.ts
│       ├── hooks/
│       ├── stores/
│       └── types/
│
└── backend/
    └── app/
        ├── main.py
        ├── config.py
        ├── database.py
        ├── models/
        ├── schemas/
        ├── routers/
        ├── services/
        ├── tasks/
        └── utils/
```

---

## 5. Database Schema

All tables need `created_at` + `updated_at TIMESTAMPTZ` columns.

### `users`
```sql
id UUID PRIMARY KEY DEFAULT gen_random_uuid()
email TEXT UNIQUE NOT NULL
full_name TEXT
avatar_url TEXT
gmail_access_token TEXT        -- Fernet encrypted
gmail_refresh_token TEXT       -- Fernet encrypted
gmail_token_expiry TIMESTAMPTZ
apollo_api_key TEXT            -- Fernet encrypted
```

### `companies`
```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
domain TEXT
industry TEXT
size_range TEXT
headquarters TEXT
website TEXT
linkedin_url TEXT
apollo_id TEXT UNIQUE          -- Apollo.io org ID for dedup
description TEXT
tags TEXT[]
created_by UUID REFERENCES users(id)
```

### `contacts`
```sql
id UUID PRIMARY KEY
first_name TEXT NOT NULL
last_name TEXT NOT NULL
email TEXT
phone TEXT
title TEXT
linkedin_url TEXT
company_id UUID REFERENCES companies(id)
apollo_id TEXT UNIQUE          -- Apollo.io person ID for dedup
source TEXT                    -- 'manual' | 'apollo' | 'import'
notes TEXT
tags TEXT[]
created_by UUID REFERENCES users(id)
```

### `outreach_records`
```sql
id UUID PRIMARY KEY
contact_id UUID REFERENCES contacts(id)
company_id UUID REFERENCES companies(id)
status TEXT   -- 'not_contacted'|'reached_out'|'replied'|'meeting_scheduled'|'closed'|'rejected'
channel TEXT  -- 'email'|'linkedin'|'phone'|'in_person'
priority TEXT DEFAULT 'medium'
assigned_to UUID REFERENCES users(id)
next_follow_up TIMESTAMPTZ
notes TEXT
created_by UUID REFERENCES users(id)
```

### `email_templates`
```sql
id UUID PRIMARY KEY
name TEXT NOT NULL
subject TEXT NOT NULL
body_html TEXT NOT NULL
body_text TEXT
variables TEXT[]   -- ['{{first_name}}', '{{company}}']
created_by UUID REFERENCES users(id)
```

### `email_logs`
```sql
id UUID PRIMARY KEY
contact_id UUID REFERENCES contacts(id)
outreach_id UUID REFERENCES outreach_records(id)
template_id UUID REFERENCES email_templates(id)
from_address TEXT NOT NULL
to_address TEXT NOT NULL
subject TEXT NOT NULL
body_html TEXT
status TEXT   -- 'draft'|'scheduled'|'sent'|'failed'
scheduled_for TIMESTAMPTZ
sent_at TIMESTAMPTZ
gmail_message_id TEXT
error_message TEXT
created_by UUID REFERENCES users(id)
```

### `activity_log`
```sql
id UUID PRIMARY KEY
entity_type TEXT   -- 'contact'|'company'|'outreach'|'email'
entity_id UUID
action TEXT        -- 'created'|'updated'|'emailed'|'status_changed'
metadata JSONB
performed_by UUID REFERENCES users(id)
created_at TIMESTAMPTZ
```

> After creating tables, add `search_vector tsvector` + GIN indexes to `contacts`, `companies`, `outreach_records` for full-text search. Update vectors via DB triggers.

---

## 6. Backend Build Instructions

### Setup
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # fill in all values
alembic upgrade head
uvicorn app.main:app --reload
```

### Environment Variables (`backend/.env`)
```
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/tcg
REDIS_URL=redis://localhost:6379/0
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret
APOLLO_BASE_URL=https://api.apollo.io/v1
ENCRYPTION_KEY=<generate: from cryptography.fernet import Fernet; Fernet.generate_key()>
FRONTEND_URL=http://localhost:3000
ENVIRONMENT=development
```

### API Rules
- All routes prefixed `/api/v1`
- All endpoints require `Depends(get_current_user)` except `/api/v1/auth/*`
- Response envelope: `{"data": ..., "meta": {"total": int, "page": int, "per_page": int}}`
- Routers call services; services contain all business logic; no raw DB in routers
- Log all errors, never silence 500s

### Apollo.io Service (`services/apollo_service.py`)
```python
async def search_people(query: str, filters: dict) -> list[ApolloContact]
async def search_organizations(query: str, filters: dict) -> list[ApolloCompany]
async def enrich_contact(email: str) -> ApolloContact
async def enrich_company(domain: str) -> ApolloCompany
async def import_contact_to_db(apollo_contact, user_id) -> Contact
async def import_company_to_db(apollo_company, user_id) -> Company
```

**Apollo.io API:**
- Search people: `POST https://api.apollo.io/v1/mixed_people/search`
- Search orgs: `POST https://api.apollo.io/v1/mixed_companies/search`
- Enrich by email: `POST https://api.apollo.io/v1/people/match`
- Auth: `X-Api-Key: {api_key}` header
- Rate: 50 req/min → use `tenacity` with exponential backoff
- Always check `apollo_id` before insert to prevent duplicates

**Apollo → Contact field mapping:**
```
apollo.id               → apollo_id
apollo.first_name       → first_name
apollo.last_name        → last_name
apollo.email            → email
apollo.phone_numbers[0].sanitized_number → phone
apollo.title            → title
apollo.linkedin_url     → linkedin_url
apollo.organization     → look up / create company
```

### Gmail Service (`services/gmail_service.py`)
```python
async def get_gmail_service(user) -> Resource
async def send_email(user, to, subject, body_html, body_text) -> str
async def schedule_email(email_log_id, send_at) -> None   # enqueues Celery task
async def list_sent_emails(user, contact_email) -> list
async def refresh_token_if_needed(user) -> User           # ALWAYS call before Gmail calls
```

Scopes needed: `gmail.send`, `gmail.readonly`
Packages: `google-api-python-client`, `google-auth`, `google-auth-oauthlib`

### Celery Email Task
```python
@celery_app.task(bind=True, max_retries=3)
def send_scheduled_email(self, email_log_id: str):
    # 1. Fetch email_log, verify status == 'scheduled'
    # 2. Call gmail_service.send_email()
    # 3. Update status='sent', set sent_at
    # 4. Write activity_log entry
    # 5. On failure: status='failed', log error, retry with backoff
```

---

## 7. Frontend Build Instructions

### Setup
```bash
cd frontend
npm install
npx shadcn-ui@latest init    # TypeScript + Tailwind
npm install framer-motion cmdk
cp .env.local.example .env.local
npm run dev
```

### Key Pages

**Login (`/login`)**
- Full-screen `bg-tcg-hero` gradient
- Centered white card, `shadow-tcg-float`, rounded-2xl
- React Bits: `Rising Lines` or `Aurora` animated background
- React Bits: `BlurText` on "Technology Consulting Group" tagline

**Dashboard Home (`/`)**
- 4 stat cards: Total Contacts, Companies, Emails Sent, Scheduled
- React Bits: `AnimatedCounter` on every number
- Recent Activity list — React Bits: `AnimatedList`
- Outreach pipeline status bar
- Quick Actions — React Bits: `Magnetic` hover effect

**Contacts List (`/contacts`)**
- TanStack Table: Name | Title | Company | Email | Status | Last Contacted | Tags
- Filters: company, status, tags, date range
- "Import from Apollo" button → slide-over panel
- React Bits: `AnimatedList` on table row entrance
- Bulk: add to outreach, export CSV, delete

**Contact Detail (`/contacts/[id]`)**
- Tabs: Overview | Outreach History | Emails | Notes
- React Bits: `Depth Card` on summary stat cards

**Apollo Search Panel (slide-over)**
- Debounced search (300ms), toggle People / Organizations
- "Import" per result with dedup check
- React Bits: `AnimatedList` on results

**Email Composer (`/emails`)**
- 3-col: recipient | Tiptap editor | template/schedule options
- Schedule picker: date + time + timezone
- React Bits: `Hover Preview` on template cards

**Global Search (`/search`)**
- `Cmd+K` shortcut (cmdk) + top nav bar
- Results grouped: Contacts | Companies | Outreach | Emails
- React Bits: `BlurText` on empty state

**Settings Integrations (`/settings/integrations`)**
- Apollo: API key input + "Test Connection"
- Gmail: "Connect Gmail Account" → Google OAuth flow

---

## 8. Claude Code Agents

Create these files in `.claude/agents/`. Claude Code auto-invokes the right specialist.

### `frontend-designer.md`
```markdown
---
name: frontend-designer
description: All UI, animations, React Bits, Tailwind, color theming. Invoke for any frontend component, page, or visual work.
model: claude-opus-4-5
tools: [Read, Write, Bash]
---
You are a senior frontend engineer for TCG. Enforce the TCG white+blue design system (CLAUDE.md Section 1). Install React Bits via CLI (npx shadcn@latest add https://reactbits.dev/r/<Name>-TS-TW). Place all React Bits components in frontend/src/components/ReactBits/. Override colors to TCG palette. Write TypeScript + Tailwind only (no inline styles). Every page needs a loading skeleton. Use framer-motion AnimatePresence for route transitions.
```

### `backend-engineer.md`
```markdown
---
name: backend-engineer
description: FastAPI routes, services, Pydantic schemas, auth, business logic. Invoke for any backend/API work.
model: claude-sonnet-4-5
tools: [Read, Write, Bash]
---
You are a senior Python/FastAPI engineer for TCG. Routers call services; all business logic in services. All endpoints need JWT auth (Depends(get_current_user)) except /auth/*. Response format: {"data": ..., "meta": {...}}. Use async/await throughout. Write docstrings for all public functions.
```

### `db-architect.md`
```markdown
---
name: db-architect
description: Database schema, Alembic migrations, query optimization, indexes. Invoke for schema changes or DB performance.
model: claude-sonnet-4-5
tools: [Read, Write, Bash]
---
You are a PostgreSQL + SQLAlchemy expert for TCG. Follow schema patterns in CLAUDE.md Section 5. Always write reversible migrations (include downgrade()). Test upgrade AND downgrade locally. Add GIN indexes for full-text search, B-tree for FK columns. Never run destructive migrations without user confirmation.
```

### `test-writer.md`
```markdown
---
name: test-writer
description: Write backend pytest and frontend Vitest tests. Invoke after any new feature or to improve coverage.
model: claude-sonnet-4-5
tools: [Read, Write, Bash]
---
Backend: use httpx.AsyncClient + pytest-asyncio. Mock all external APIs (Apollo, Gmail) — never make real calls in tests. Test happy path, errors, edge cases, auth. Target 80% coverage. Frontend: use Vitest + React Testing Library, mock with msw. Test user interactions not implementation details.
```

### `bug-fixer.md`
```markdown
---
name: bug-fixer
description: Diagnose and fix bugs using web search. Invoke on any error or unexpected behavior.
model: claude-opus-4-5
tools: [Read, Write, Bash, WebFetch, WebSearch]
---
Debug systematically: 1) Reproduce the exact error. 2) WebSearch the error message + package version. 3) Diagnose root cause from docs/issues. 4) Apply minimal targeted fix. 5) Re-run tests to verify. 6) Add bug+fix to CLAUDE.md Section 14. Never guess — always verify against current documentation.
```

### `api-integrator.md`
```markdown
---
name: api-integrator
description: Apollo.io, Gmail API, Google OAuth integrations. Invoke for any third-party API work.
model: claude-opus-4-5
tools: [Read, Write, Bash, WebFetch, WebSearch]
---
Apollo: check https://apolloio.github.io/apollo-api-docs/, respect 50 req/min limit, use tenacity backoff, map fields per CLAUDE.md Section 6. Gmail: check https://developers.google.com/gmail/api, always refresh_token_if_needed() before calls, use google-api-python-client. Handle partial/null responses gracefully from both APIs.
```

---

## 9. Custom Slash Commands

Create these files in `.claude/commands/`. Type `/command-name` in Claude Code to use.

### `build-phase.md`
```markdown
---
description: Execute a build phase. Usage: /build-phase 2
---
Read CLAUDE.md Section 11 and execute Phase $ARGUMENTS completely. Before starting: check existing files, run tests for baseline. Build each item sequentially. Run tests after each major item. Report complete with summary.
```

### `fix-bug.md`
```markdown
---
description: Research and fix a bug. Usage: /fix-bug "error description"
---
Use the bug-fixer agent to diagnose and fix: $ARGUMENTS
Process: reproduce → search web → diagnose → fix → verify → document in CLAUDE.md Section 14.
```

### `write-tests.md`
```markdown
---
description: Write tests for a feature. Usage: /write-tests "ContactList component"
---
Use the test-writer agent to write comprehensive tests for: $ARGUMENTS
Cover: happy path, errors, edge cases, auth. Run tests after writing to verify they pass.
```

### `add-animation.md`
```markdown
---
description: Add a React Bits animation. Usage: /add-animation "stat cards on dashboard"
---
Use the frontend-designer agent to add a React Bits animation to: $ARGUMENTS
Find best component on reactbits.dev, install with CLI, override colors to TCG palette, test mobile.
```

### `new-page.md`
```markdown
---
description: Scaffold a complete new page. Usage: /new-page "team management page"
---
Scaffold a complete Next.js page for: $ARGUMENTS
Create: page component, loading skeleton, empty state with BlurText, TanStack Query hook, error boundary, Sidebar nav link, any new API routes needed.
```

### `new-api-route.md`
```markdown
---
description: Scaffold a new API endpoint. Usage: /new-api-route "GET contacts by company"
---
Use the backend-engineer agent to scaffold: $ARGUMENTS
Create: router function, service method, Pydantic schemas, tests, register router.
```

### `db-migrate.md`
```markdown
---
description: Create and run a migration. Usage: /db-migrate "add tags array to contacts"
---
Use the db-architect agent to create migration for: $ARGUMENTS
Process: update model → generate migration → review → test upgrade → test downgrade → re-upgrade → run test suite.
```

### `deploy-check.md`
```markdown
---
description: Run full pre-deployment checklist before deploying.
---
Run ALL checks from CLAUDE.md Section 10:
1. cd backend && pytest tests/ -v
2. cd frontend && npm test
3. cd frontend && npm run build
4. Search for hardcoded secrets in source (should be zero)
5. Verify CORS matches FRONTEND_URL
6. Verify Fernet encryption on all token fields
7. Run npm audit + pip audit
Report PASS or list all failures.
```

---

## 10. Security Checklist

- [ ] All secrets in `.env` files — never committed to git
- [ ] `gmail_access_token`, `gmail_refresh_token` encrypted with Fernet before DB storage
- [ ] `apollo_api_key` encrypted with Fernet before DB storage
- [ ] CORS restricted to `FRONTEND_URL` only
- [ ] JWT: verify `exp`, `iss`, `aud` claims
- [ ] Rate limiting on Apollo proxy endpoints
- [ ] Input sanitization on all user-supplied content
- [ ] Email `to` field validated as proper address before sending

---

## 11. Build Order

**Phase 1 — Foundation**
1. Monorepo structure + Docker Compose
2. FastAPI app: config, database, health endpoint
3. Next.js app: Tailwind + TCG colors + shadcn/ui init
4. Supabase project setup, get all keys
5. Supabase Auth + Google OAuth in frontend
6. JWT middleware in backend
7. Verify full auth flow end-to-end

**Phase 2 — Core CRM**
1. All DB models + first Alembic migration
2. Contacts CRUD API + contacts pages
3. Companies CRUD API + companies pages
4. Outreach records API + pipeline board
5. Activity logging
6. Tests for all of Phase 2

**Phase 3 — Design Polish**
1. Install React Bits: `npm install framer-motion` + install components per Section 2 table
2. Apply TCG color scheme across all pages
3. Sidebar: `bg-tcg-sidebar` gradient, white text
4. Login page: hero gradient + React Bits animated background + BlurText
5. Dashboard: `AnimatedCounter` on stats, `AnimatedList` on activity
6. Contact list: `AnimatedList` row entrance
7. `Cmd+K` search palette with cmdk
8. Depth Card on kanban outreach board

**Phase 4 — Integrations**
1. Apollo: settings key input + test connection
2. Apollo: search panel UI + import flow with dedup
3. Gmail: OAuth token storage + refresh logic
4. Gmail: send email + Tiptap email editor
5. Gmail: template CRUD
6. Gmail: scheduled send (Celery task + schedule UI)
7. Tests for all of Phase 4

**Phase 5 — Search & Polish**
1. `tsvector` columns + GIN indexes + update triggers
2. Universal search API endpoint
3. Search UI: `/search` page + Cmd+K integration
4. Bulk actions: CSV export, batch outreach add
5. Mobile responsive pass
6. Error boundaries + loading skeletons everywhere
7. Audit all React Bits colors — confirm TCG palette applied

**Phase 6 — Deployment**
1. Run `/deploy-check`
2. Configure production env vars in Vercel + Railway
3. Deploy backend → Railway
4. Deploy frontend → Vercel
5. Smoke test all features in production

---

## 12. Claude Code: Complete Feature Guide

*For first-time users — everything you need to know.*

---

### Slash Commands — The `/` Menu

Type `/` in Claude Code to see all commands. Here are the built-in ones:

| Command | What it does |
|---|---|
| `/help` | Show all commands, including your custom ones |
| `/clear` | **Wipe conversation history** — use at start of each new task |
| `/compact` | Summarize old messages to free context window space |
| `/context` | See what's currently loaded in the context window |
| `/memory` | Edit Claude's persistent memory about your project |
| `/agents` | View/manage available subagents |
| `/install-github-app` | Auto-review GitHub PRs with Claude |
| `/init` | Generate a CLAUDE.md for a new project |
| `/vim` | Toggle vim keybindings |

**This project's custom commands** (defined in `.claude/commands/`):
`/build-phase` `/fix-bug` `/write-tests` `/add-animation` `/new-page` `/new-api-route` `/db-migrate` `/deploy-check`

---

### Subagents — Parallel Specialists

Claude Code can spawn specialist agents for different parts of the codebase. You don't have to manage them — Claude auto-invokes the right one based on what you ask for.

This project's agents (in `.claude/agents/`):
- **frontend-designer** — UI, React Bits, colors, Tailwind
- **backend-engineer** — FastAPI, Python, APIs
- **db-architect** — Schema, migrations, queries
- **test-writer** — pytest and Vitest coverage
- **bug-fixer** — Debugging with web search
- **api-integrator** — Apollo.io and Gmail API work

You can also manually direct: *"Use the frontend-designer agent to rebuild the sidebar"*

**Background agents:** If an agent is running a long task, press `Ctrl+B` to send it to the background. Keep working. It reports back when done.

---

### Web Search — How It Fixes Bugs Automatically

This is the most important capability for unblocking yourself.

**How it works:**
1. The `bug-fixer` agent has `WebSearch` and `WebFetch` tools enabled
2. When you hit an error, it searches for the exact error message
3. It fetches actual docs pages, GitHub issues, and Stack Overflow answers
4. It applies a verified fix — not a guess based on training data

**How to enable web search on an agent:**
Add `WebSearch` and `WebFetch` to the `tools:` list in `.claude/agents/<name>.md`. Already done for `bug-fixer` and `api-integrator` in this project.

**Triggering auto-debug:**
```
/fix-bug "ModuleNotFoundError: No module named 'celery'"
/fix-bug "Apollo import fails with 422 validation error"
/fix-bug "React Bits BlurText not animating on first render"
```
Or just describe the symptom: *"The email scheduler isn't sending emails, figure out why and fix it."*

Claude will search, diagnose, fix, and document the fix in Section 14 of this file.

**Manual web search mid-conversation:**
You can also just say: *"Search the Apollo.io docs for how to filter by company size"* and Claude will fetch the current docs and apply what it finds.

---

### @ File References

Type `@` to include any file in your prompt:
```
@frontend/src/components/layout/Sidebar.tsx — update nav item colors to match Section 1
@backend/app/routers/contacts.py — add cursor-based pagination
@CLAUDE.md — what does Phase 3 require?
@frontend/src/app/(dashboard)/page.tsx — add AnimatedCounter to the stats section
```

---

### Queue Multiple Tasks

Claude Code handles a task queue. You can keep typing while it works:
```
Build the contacts list page
[Claude starts working]
Also add the filters sidebar
[queued]
And write tests for the contacts router too
[queued]
```
Claude is smart about execution order and will pause if it needs your input before continuing.

---

### Hooks — Automated Event Triggers

Hooks run automatically when specific Claude Code events occur. Create in `.claude/hooks/`:

| Hook file | When it runs |
|---|---|
| `pre-tool-call.sh` | Before Claude runs any tool |
| `post-tool-call.sh` | After any tool finishes |
| `notification.sh` | On task completion |

**Example — Desktop notification when a task finishes:**
```bash
# .claude/hooks/notification.sh
osascript -e 'display notification "Claude Code finished a task" with title "TCG Platform"'
```

---

### MCP Servers — Connect Claude to External Tools

MCP (Model Context Protocol) lets Claude Code talk directly to external services:

```bash
# GitHub — Claude can read issues, review PRs, check CI
claude mcp add --transport stdio github npx -y @modelcontextprotocol/server-github

# Supabase — Claude can query your live database
claude mcp add --transport stdio supabase \
  npx -y @supabase/mcp-server-supabase@latest \
  --access-token <your-supabase-personal-access-token>
```

After adding GitHub MCP: *"Check the open issues and fix the highest priority bug"*
After adding Supabase MCP: *"Query contacts table, how many have no email address?"*

---

### Permission Mode

- **Default:** Claude asks permission before each bash command (good for learning)
- **Skip permissions:** Claude runs everything without asking (good for trusted builds)
  ```bash
  claude --dangerously-skip-permissions
  ```
  Equivalent to Cursor's "yolo mode." Saves a lot of `[y]` presses. Your risk call.

---

### Context Management

- `/clear` when starting a new task — don't carry baggage from previous work
- `/compact` when the context gets large (Claude will warn you it's filling up)
- After compacting: `@CLAUDE.md read this and continue building Phase 3`
- Best practice: one conversation per feature or task

---

## 13. External API Reference

### Apollo.io
- Base URL: `https://api.apollo.io/v1`
- Auth: `X-Api-Key: {key}` in header
- Docs: `https://apolloio.github.io/apollo-api-docs/`
- Endpoints: `POST /mixed_people/search`, `POST /mixed_companies/search`, `POST /people/match`

### Gmail API
- Docs: `https://developers.google.com/gmail/api`
- Client: `google-api-python-client`
- Auth: OAuth 2.0 via Supabase Google provider
- Scopes: `gmail.send`, `gmail.readonly`

### Supabase
- Dashboard: `https://app.supabase.com`
- JWT Secret: Settings → API → JWT Secret (NOT service role key)

---

## 14. Common Issues & Fixes

Add new bugs here as discovered — the bug-fixer agent reads this section:

| Issue | Root Cause | Fix |
|---|---|---|
| Supabase JWT 401 | Using service role key instead of JWT Secret | Go to Supabase Settings → API → JWT Secret |
| Gmail 401 day after setup | Access token expired | Always call `refresh_token_if_needed()` before Gmail calls |
| Apollo 429 Too Many Requests | Hit 50 req/min free tier limit | Use `tenacity` retry with exponential backoff, max 3 retries |
| Celery tasks not running | Worker process not started | Run `celery -A app.tasks.celery_app worker` as separate process |
| CORS error in browser | FRONTEND_URL missing from allowed origins | Add to FastAPI CORSMiddleware origins list |
| Alembic "can't locate revision" | alembic_version table out of sync | Drop alembic_version table, re-run `alembic upgrade head` (dev only) |
| React Bits CLI install fails | Wrong variant suffix | Use `-TS-TW` for TypeScript + Tailwind (e.g., `BlurText-TS-TW`) |
| Full-text search returns nothing | tsvector not updated after insert | Verify DB trigger is attached to table and fires on INSERT + UPDATE |
| Fernet decrypt error | Key mismatch between encrypt/decrypt | Ensure same `ENCRYPTION_KEY` env var in all processes including Celery |

---

*Last updated: 2026-02-26 | TCG Engineering | texastcg.com*