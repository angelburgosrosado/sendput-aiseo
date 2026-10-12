# Contributing to SignalForge (Sendput AI SEO)

Thank you for your interest in contributing! This document details guidelines and workflows for contributing code, reporting bugs, and submitting pull requests.

---

## 🛠️ Prerequisites

- **Runtime**: [Bun](https://bun.sh/) (v1.2+ recommended) or Node.js (v20+)
- **Database**: PostgreSQL 15+ (available locally or via Docker Compose)
- **Git**: Configured with your developer credentials

---

## 🚀 Getting Started

1. **Fork & Clone**:
   ```bash
   git clone git@github.com:angelburgosrosado/sendput-aiseo.git
   cd sendput-aiseo
   ```

2. **Install Dependencies**:
   ```bash
   bun install
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Ensure `DATABASE_URL` matches your local database instance or run Docker:
   ```bash
   docker compose up -d postgres
   ```

4. **Initialize Prisma Database**:
   ```bash
   bun run prisma:push
   bun run prisma:seed
   ```

5. **Start Development Server**:
   ```bash
   bun run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📋 Development Workflow

### Branching Convention
Create focused feature or fix branches from `main`:
- `feat/feature-name`
- `fix/bug-description`
- `docs/documentation-update`
- `refactor/component-name`

### Code Quality & Validation Checks
Before opening a Pull Request, ensure all checks pass:

```bash
# 1. Run linter
bun run lint

# 2. Run unit and integration tests
bun run test

# 3. Test production build
bun run build

# 4. (Optional) Run Playwright E2E tests
bun run test:e2e
```

---

## 🔒 Security & Sensitive Data

- **Never commit `.env` or API credentials**. Keep all production API secrets out of git tracking.
- Test against mock datasets whenever possible using `USE_MOCK_FALLBACK="true"`.

---

## 📬 Pull Request Process

1. Ensure all CI checks and tests pass locally.
2. Submit a Pull Request targeting the `main` branch.
3. Fill out the PR template completely with details of what was changed and how to verify.
4. CI workflows will automatically execute linting, tests, and production build checks.
