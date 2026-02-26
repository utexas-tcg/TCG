# TCG Platform — Build Tracker

## Phase 1 — Foundation
- [x] .gitignore
- [x] docker-compose.yml
- [x] .github/workflows/ci.yml
- [x] .github/workflows/deploy.yml
- [x] .claude/agents/ (6 specialist agents)
- [x] .claude/commands/ (8 custom commands)
- [ ] backend/ FastAPI foundation
- [ ] backend/.env.example
- [ ] frontend/ Next.js foundation
- [ ] frontend/.env.local.example
- [ ] Phase 1 commit

## Phase 2 — Core CRM
- [ ] DB models + Alembic migration
- [ ] Contacts CRUD API
- [ ] Companies CRUD API
- [ ] Outreach records API
- [ ] Activity logging
- [ ] Contacts frontend page (TanStack Table)
- [ ] Companies frontend page
- [ ] Outreach Kanban board
- [ ] Contact detail page
- [ ] Tests for Phase 2
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
- [ ] tsvector + GIN indexes + triggers
- [ ] Universal search API
- [ ] Search UI page
- [ ] Bulk actions (CSV export)
- [ ] Mobile responsive
- [ ] Error boundaries
- [ ] Phase 5 commit

## Phase 6 — Deployment
- [ ] vercel.json
- [ ] Railway config
- [ ] CI/CD pipelines
- [ ] Production env templates
- [ ] Phase 6 commit
