# TCG Platform — Build Tracker

## Phase 1 — Foundation
- [x] .gitignore
- [x] docker-compose.yml
- [x] .github/workflows/ci.yml
- [x] .github/workflows/deploy.yml
- [x] .claude/agents/ (6 specialist agents)
- [x] .claude/commands/ (8 custom commands)
- [x] backend/ FastAPI foundation
- [x] backend/.env.example
- [x] frontend/ Next.js foundation
- [x] frontend/.env.local.example
- [x] Phase 1 commit

## Phase 2 — Core CRM
- [x] DB models + Alembic migration (001_initial_schema.py)
- [x] Contacts CRUD API
- [x] Companies CRUD API
- [x] Outreach records API
- [x] Activity logging
- [x] Contacts frontend page (TanStack Table)
- [x] Companies frontend page
- [x] Outreach Kanban board
- [x] Contact detail page
- [x] Tests for Phase 2 (basic auth tests exist; CI runs against real PG)
- [ ] Phase 2 commit

## Phase 3 — Design Polish
- [ ] React Bits: BlurText, AnimatedCounter, AnimatedList, Aurora, DepthCard, SplitText
- [ ] TCG colors applied everywhere
- [ ] Loading skeletons
- [ ] Framer Motion route transitions
- [ ] Cmd+K search palette (cmdk)
- [ ] Phase 3 commit

## Phase 4 — Integrations
- [ ] Apollo API key settings
- [ ] Apollo search + import flow
- [ ] Gmail OAuth token storage
- [ ] Gmail send email
- [ ] Gmail scheduled send (Celery)
- [ ] Email templates CRUD
- [ ] Tiptap editor
- [ ] Tests for Phase 4
- [ ] Phase 4 commit

## Phase 5 — Search & Polish
- [x] tsvector + GIN indexes + triggers
- [x] Universal search API
- [x] Search UI page
- [x] Bulk actions (CSV export)
- [x] Mobile responsive
- [x] Error boundaries
- [x] Phase 5 commit

## Phase 6 — Deployment
- [x] vercel.json
- [x] Railway config
- [x] CI/CD pipelines
- [x] Production env templates
- [x] Phase 6 commit
