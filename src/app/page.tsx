import Link from "next/link";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  ClipboardList,
  FolderKanban,
  GitCompare,
  History,
  ShieldCheck,
  Terminal
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { SectionHeading } from "@/components/section-heading";
import { FeatureCard } from "@/components/feature-card";
import { GradientCard } from "@/components/gradient-card";
import { DashboardCard } from "@/components/dashboard-card";
import { ScrollReveal } from "@/components/scroll-reveal";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: Terminal,
    title: "Dynamic Request Builder",
    description: "Compose GET/POST/PUT/PATCH/DELETE requests with headers, query params, and JSON, raw, or form-data bodies."
  },
  {
    icon: CheckCircle2,
    title: "Custom Assertion Engine",
    description: "Assert on status, body, or headers with equals, contains, exists, regex, and more — no eval, ever."
  },
  {
    icon: GitCompare,
    title: "Response Diff Checker",
    description: "Deep-compare two JSON payloads and see exactly what was added, removed, or changed."
  },
  {
    icon: History,
    title: "Request History",
    description: "Every request you send is logged automatically — searchable, filterable, and one click to duplicate."
  },
  {
    icon: FolderKanban,
    title: "Collections",
    description: "Group related requests together and reopen or update them any time."
  },
  // {
  //   icon: ClipboardList,
  //   title: "Audit Logs",
  //   description: "Every admin action is recorded in a simple, transparent log."
  // },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Method breakdowns, status distributions, and assertion pass rates at a glance."
  },
  // {
  //   icon: ShieldCheck,
  //   title: "Admin Panel",
  //   description: "Role-based administration for managing users, collections, and platform-wide activity."
  // }
];

const WORKFLOW_STEPS = [
  "Build Request",
  "Send API",
  "Validate Assertions",
  "Compare Responses",
  "Save History"
];

const STATS = [
  { value: "10x", label: "Faster API debugging" },
  { value: "∞", label: "Unlimited assertions" },
  { value: "2-way", label: "Response comparisons" },
  { value: "RBAC", label: "Secure admin management" }
];

const TESTIMONIALS = [
  {
    quote:
      "Assertico replaced three separate tools in our workflow. Building and asserting on a request now takes seconds.",
    name: "J. Rivera",
    role: "Backend Engineer, Cloud Platform Team"
  },
  {
    quote:
      "The diff checker alone saved us hours during a migration — we could see exactly which fields changed shape.",
    name: "A. Chen",
    role: "QA Lead, Payments Infra"
  },
  {
    quote:
      "Having history and collections in one place made onboarding new engineers to our API surface painless.",
    name: "S. Okafor",
    role: "Staff Engineer, Developer Platform"
  }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* ---------------------------------------------------------------- */}
      {/* Hero                                                             */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute left-1/2 top-[-10%] h-[36rem] w-[36rem] -translate-x-1/2 rounded-full bg-blue-500/20 blur-[120px]" />
          <div className="absolute right-[-10%] top-[20%] h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-[120px]" />
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:items-center lg:py-32 lg:px-8">
          <div>
            {/* <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground dark:border-white/10">
              {/* <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse-dot" />
              Now with role-based admin
            </span>  */}
            <h1 className="mt-6 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Validate APIs with{" "}
              <span className="gradient-text animate-gradient">Confidence.</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg text-muted-foreground">
              Build requests, create custom assertions, compare responses, and
              debug APIs faster with an all-in-one validation workspace.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="gradient-primary text-white hover:opacity-90 glow-blue"
                >
                  Get Started
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline">
                  Explore Features
                </Button>
              </a>
            </div>
          </div>

          <div className="relative mx-auto h-[26rem] w-full max-w-md lg:mx-0">
            <div className="glass-strong absolute inset-x-4 top-6 rounded-2xl p-5 shadow-2xl">
              <div className="flex items-center justify-between">
                <span className="rounded bg-blue-500/15 px-2 py-0.5 font-mono text-xs font-semibold text-blue-400">
                  GET
                </span>
                <span className="rounded bg-emerald-500/15 px-2 py-0.5 text-xs font-semibold text-success">
                  200 OK
                </span>
              </div>
              <p className="mt-3 truncate font-mono text-xs text-muted-foreground">
                https://api.example.com/v1/users/42
              </p>
              <div className="mt-4 space-y-1.5">
                <div className="h-2 w-4/5 rounded bg-secondary" />
                <div className="h-2 w-3/5 rounded bg-secondary" />
                <div className="h-2 w-2/3 rounded bg-secondary" />
              </div>
            </div>

            <DashboardCard
              icon={CheckCircle2}
              label="Assertions"
              value="8 / 8 passed"
              accentClassName="text-success"
              className="animate-float absolute -left-2 bottom-24 w-44"
            />

            <DashboardCard
              icon={Activity}
              label="Response Time"
              value="142 ms"
              className="animate-float absolute -right-2 bottom-4 w-40"
            />

            <DashboardCard
              icon={GitCompare}
              label="Diff"
              value="3 fields changed"
              accentClassName="text-amber-500"
              className="animate-float absolute right-6 top-0 w-44"
              style={{ animationDelay: "1.5s" }}
            />
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Stats                                                            */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-y border-black/5 bg-secondary/40 dark:border-white/10">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="gradient-text text-3xl font-semibold sm:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Features                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Everything you need"
          title="One workspace, every step of API validation"
          description="From the first request to production confidence, Assertico covers the whole loop."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <ScrollReveal key={feature.title} delayMs={index * 60}>
              <FeatureCard {...feature} />
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Workflow                                                         */}
      {/* ---------------------------------------------------------------- */}
      <section id="workflow" className="border-y border-black/5 bg-secondary/40 py-24 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="How it works"
            title="From request to confidence in five steps"
          />

          <div className="mt-14 flex flex-col items-stretch gap-4 lg:flex-row lg:items-center">
            {WORKFLOW_STEPS.map((step, index) => (
              <div key={step} className="flex flex-1 items-center">
                <GradientCard className="w-full text-center">
                  <span className="text-xs font-semibold text-primary">
                    Step {index + 1}
                  </span>
                  <p className="mt-1 text-sm font-semibold">{step}</p>
                </GradientCard>
                {index < WORKFLOW_STEPS.length - 1 ? (
                  <div className="mx-2 hidden h-px flex-1 gradient-primary lg:block" />
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Testimonials                                                     */}
      {/* ---------------------------------------------------------------- */}
      <section id="testimonials" className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Loved by developers" title="What teams are saying" />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((testimonial) => (
            <GradientCard key={testimonial.name}>
              <p className="text-sm text-foreground">&ldquo;{testimonial.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full gradient-primary text-xs font-semibold text-white">
                  {testimonial.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <div>
                  <p className="text-sm font-medium">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </GradientCard>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* CTA                                                              */}
      {/* ---------------------------------------------------------------- */}
      <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <div className="animate-gradient relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-violet-600 to-cyan-500 px-8 py-16 text-center shadow-2xl">
          <h2 className="text-3xl font-semibold text-white sm:text-4xl">
            Start validating APIs faster today.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-white/80">
            Free to get started. No credit card required.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              variant="outline"
              className="mt-8 border-white/40 bg-white/10 text-white hover:bg-white/20"
            >
              Create Account
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
