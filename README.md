# Assertico

An enterprise-grade API testing, validation, and contract intelligence platform — send requests, assert on response telemetry, semantically diff payloads with AI, and retain a persistent, searchable history of test executions. Built with Next.js 15 (App Router), TypeScript, Prisma ORM, Supabase Auth, Tailwind CSS, and headless UI primitives styled to shadcn/ui conventions.

---

## Features

- **Authentication & Multi-Tenant Access Control** — Supabase Auth session management (signup/login/logout), edge middleware token verification, and role-based route guards (`USER`, `ADMIN`).
- **Resilient Request Builder** — Supports standard HTTP verbs (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`), dynamic key-value headers, query parameter serialization, raw/JSON/form-data request bodies, and client-side lifecycle cancellation via `AbortController`.
- **High-Resolution Response Telemetry** — Microsecond-accurate response latency tracking, HTTP status badges, payload byte counting, formatted syntax-highlighted JSON rendering, and headers tables.
- **Deterministic Assertion Engine (`lib/assertion-engine.ts`)** — Multi-target evaluation (`STATUS`, `RESPONSE_TIME`, `BODY`, `HEADER`) running against strict operators (`EQUALS`, `NOT_EQUALS`, `CONTAINS`, `EXISTS`, `GREATER_THAN`, `LESS_THAN`, `REGEX`). Dot-notation object traversal with zero `eval` dependencies.
- **Structural Diff Engine (`lib/diff.ts`)** — Recursive, key-order-normalized AST JSON comparator categorizing nodes into `added`, `removed`, `changed`, and `unchanged` states across arbitrary depths.
- **AI Semantic Contract Analysis (`/api/ai/analyze-diff`)** — Hybrid LLM diagnostic layer powered by Groq (`openai/gpt-oss-120b`). Digests deterministic AST deltas and socket latency shifts to flag breaking changes, SDK deprecation risks, PII/secret leaks, and payload recommendations.
- **Bounded Audit History** — Automatic logging of execution events (method, URL, headers, truncated body, status, duration, pass/fail counts). Omits response payloads to ensure zero database bloat and strict compliance.
- **Aggregated Analytics Dashboard** — Global telemetry reporting total executions, assertion pass/fail distributions, average response latency, dominant HTTP methods, and paginated recent runs.
- **Hierarchical Collections** — Group and organize target API endpoints into logical namespaces with full cascade-delete support.

---

## System Architecture

Assertico implements a hybrid execution and validation architecture. It decouples high-speed deterministic evaluation from heavy LLM contract analysis, enforcing strict network sandboxing on all outbound requests.

<p align="center">
  <img src="./public/architecture.png" alt="Assertico System Architecture & Analysis Pipeline" width="100%" />
</p>

---

## Project Structure

```text
src/
├── app/
│   ├── (auth)/                    # Authentication flows (login, register)
│   ├── (dashboard)/               # Protected workspace routes
│   │   ├── assertions/            # Global assertions inventory
│   │   ├── collections/           # Collection management views
│   │   ├── dashboard/             # Global metrics & telemetry graphs
│   │   ├── diff/                  # Visual payload comparator & AI diagnostic
│   │   ├── history/               # Request execution logs
│   │   ├── requests/              # Request builder & runner
│   │   └── settings/              # Workspace configurations
│   └── api/
│       ├── ai/
│       │   └── analyze-diff/      # Semantic contract AI route (Groq integration)
│       └── proxy/                 # SSRF-sandboxed request proxy
├── components/
│   ├── dashboard/                 # Analytics summary cards & recent activity
│   ├── diff/                      # Diff viewer, AST tree view, summary, AI card
│   ├── request/                   # Request editor, headers/body inputs, run controls
│   └── ui/                        # Button, Input, Modal, Badge, Dropdown primitives
├── hooks/                         # Key-value state, diff AI triggers, clipboard utils
├── lib/
│   ├── assertion-engine.ts        # Pure, deterministic validation engine
│   ├── diff.ts                    # Dynamic recursive AST diff engine
│   ├── prisma.ts                  # Shared database client
│   └── proxy.ts                   # Network socket & DNS resolution hooks
├── types/
│   ├── ai-diff.ts                 # Contracts for LLM semantic analysis responses
│   └── index.ts                   # Core application domain types
└── utils/                         # Class-variance authority (cn), formatting, helpers
Getting Started
Prerequisites
Node.js 18.17+ or Node.js 20+

PostgreSQL database instance (or Supabase project)

Groq API Key (free tier available at console.groq.com)

Installation
Clone the repository and install dependencies:

Bash
git clone [https://github.com/your-username/assertico.git](https://github.com/your-username/assertico.git)
cd assertico
npm install
Configure environment variables:

Bash
cp .env.example .env.local
Provide the required secrets in .env.local:

Code snippet
# Database (PostgreSQL / Supabase)
DATABASE_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres"

# Supabase Auth
NEXT_PUBLIC_SUPABASE_URL="https://[project].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# AI Semantic Contract Analysis Engine
GROQ_API_KEY="gsk_yourGroqApiKeyHere"
Run database migrations:

Bash
npx prisma generate
npx prisma migrate dev --name init
Start the development server:

Bash
npm run dev
Open http://localhost:3000 in your browser.