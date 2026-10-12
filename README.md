<div align="center">

# SignalForge (Sendput AI SEO)

**Enterprise Search Intelligence, AI Answers Visibility & Generative Engine Optimization (GEO)**

[![CI](https://github.com/angelburgosrosado/sendput-aiseo/actions/workflows/ci.yml/badge.svg)](https://github.com/angelburgosrosado/sendput-aiseo/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Bun](https://img.shields.io/badge/Bun-1.2-fbf0df?logo=bun&logoColor=black)](https://bun.sh/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📖 Overview

**SignalForge** is an enterprise-grade search and AI visibility intelligence platform designed to monitor, analyze, and optimize digital presence across traditional search engines and next-generation AI discovery surfaces (ChatGPT Search, Google AI Overviews, Perplexity, Claude, and Gemini).

By unifying traditional SEO metrics with AI citation tracking, brand mention share, and structured data discovery, SignalForge provides complete visibility into how AI models perceive and recommend your brand.

---

## ✨ Key Features

- **🤖 AI Answers & GEO Intelligence**: Track citations, brand mentions, and sentiment across generative AI platforms and AI Overviews.
- **🔍 Unified SERP & Keyword Tracking**: High-precision rank tracking with volatility scoring and intent categorization.
- **🏗️ Technical Audits**: Deep-crawl audits detecting Core Web Vitals bottlenecks, schema health, and indexing blockers.
- **🔗 Backlink & Authority Analysis**: In-depth link profile monitoring, toxic link alerts, and domain citation graphs.
- **📍 Local SEO & Google Business Profile**: Multi-location visibility maps, review sentiment tracking, and local pack rankings.
- **📊 Real-time Executive Reports**: Automated PDF/CSV exports, shareable dashboards, and customized KPI alert delivery.
- **🔌 Enterprise Integrations**: Direct OAuth connections with Google Search Console, Google Analytics 4, Bing Webmaster Tools, DataForSEO, and SerpAPI.
- **🛡️ Secure & Compliant**: Role-based access control (RBAC), immutable audit logging, and data privacy safeguards.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server & Client Components)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/), [Lucide React](https://lucide.dev/), [Recharts](https://recharts.org/)
- **Database & ORM**: [PostgreSQL 15+](https://www.postgresql.org/), [Prisma ORM 6](https://www.prisma.io/)
- **Runtime & Package Manager**: [Bun](https://bun.sh/)
- **Testing**: [Vitest](https://vitest.dev/) (Unit/Integration), [Playwright](https://playwright.dev/) (End-to-End)
- **Containerization**: [Docker](https://www.docker.com/), [Docker Compose](https://docs.docker.com/compose/)
- **CI/CD**: GitHub Actions

---

## 🚀 Quick Start

### 1. Prerequisites
- **[Bun](https://bun.sh/)** installed (`curl -fsSL https://bun.sh/install | bash`)
- **[Docker Desktop](https://www.docker.com/)** or local PostgreSQL 15+

### 2. Clone Repository
```bash
git clone git@github.com:angelburgosrosado/sendput-aiseo.git
cd sendput-aiseo
```

### 3. Install Dependencies
```bash
bun install
```

### 4. Configure Environment
Copy the example environment configuration:
```bash
cp .env.example .env
```

### 5. Launch Database & Seed Data
Start PostgreSQL via Docker Compose:
```bash
docker compose up -d postgres
```

Generate Prisma client and apply database migrations:
```bash
bun run prisma:push
bun run prisma:seed
```

### 6. Run the Development Server
```bash
bun run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
| :--- | :--- |
| `bun run dev` | Starts local Next.js development server at `localhost:3000` |
| `bun run build` | Builds optimized production bundle |
| `bun run start` | Starts production server |
| `bun run lint` | Runs Next.js ESLint verification |
| `bun run test` | Executes unit and integration test suite via Vitest |
| `bun run test:watch` | Runs Vitest in interactive watch mode |
| `bun run test:e2e` | Runs end-to-end browser tests via Playwright |
| `bun run prisma:generate` | Regenerates Prisma Client types |
| `bun run prisma:push` | Pushes Prisma schema updates to the active database |
| `bun run prisma:seed` | Seeds database with demo intelligence datasets |

---

## 🐳 Docker Deployment

To spin up the entire application along with PostgreSQL using Docker Compose:

```bash
docker compose up --build -d
```

To stop containers:
```bash
docker compose down
```

---

## 🔄 GitHub Workflows & CI/CD

This repository is equipped with GitHub Actions automation:

- **CI Pipeline (`.github/workflows/ci.yml`)**: Triggered on pushes and PRs to `main`. Installs dependencies via Bun, runs Prisma generation, lints code, runs unit tests, and validates production builds.
- **E2E Pipeline (`.github/workflows/e2e.yml`)**: Runs Playwright browser tests and archives test artifacts on demand or on relevant UI changes.

---

## 🤝 Contributing

We welcome contributions! Please review [CONTRIBUTING.md](file:///Volumes/MacAI/ABGlobalCEO/sendput-ai/CONTRIBUTING.md) for branch naming standards, code review procedures, and testing requirements before opening a PR.

---

## 📄 License

This project is licensed under the MIT License.
