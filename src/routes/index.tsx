import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { TrainFront, ShieldCheck, Activity, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in · SGR Guardian Command" },
      { name: "description", content: "Secure sign in for SGR Guardian command center — Tanzania SGR corridor operations." },
    ],
  }),
  component: LoginPage,
});

const BRAND_IMAGES = [
  "https://images.pexels.com/photos/26928541/pexels-photo-26928541.png",
  "https://images.pexels.com/photos/29033695/pexels-photo-29033695.jpeg",
  "https://images.pexels.com/photos/36644775/pexels-photo-36644775.jpeg",
  "https://images.pexels.com/photos/29508383/pexels-photo-29508383.jpeg",
];

function LoginPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("emmanuel.mwita@sgr.tz");
  const [password, setPassword] = useState("guardian2026");
  const [loading, setLoading] = useState(false);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    BRAND_IMAGES.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
    const id = setInterval(() => {
      setSlide((s) => (s + 1) % BRAND_IMAGES.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 600);
  }

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-background">
      {/* LEFT — Brand panel with oval rounded edge */}
      <aside
        className="relative hidden lg:flex flex-col justify-between w-[46%] xl:w-[42%] p-12 text-white overflow-hidden"
        style={{
          borderTopRightRadius: "60% 100%",
          borderBottomRightRadius: "60% 100%",
        }}
      >
        {/* Photographic background — crossfading slideshow */}
        {BRAND_IMAGES.map((src, i) => (
          <div
            key={src}
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-cover bg-center transition-opacity duration-[1500ms] ease-in-out"
            style={{
              backgroundImage: `url('${src}')`,
              opacity: slide === i ? 1 : 0,
              transform: slide === i ? "scale(1.05)" : "scale(1)",
              transition: "opacity 1500ms ease-in-out, transform 6000ms ease-out",
            }}
          />
        ))}
        {/* Navy gradient overlay for readability */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(28,80,168,0.48) 0%, rgba(16,54,125,0.56) 50%, rgba(8,28,69,0.70) 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/45 via-black/20 to-transparent" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-black/10" />
        {/* decorative orbs */}
        <div className="pointer-events-none absolute -left-24 top-24 size-72 rounded-full bg-sky/20 blur-3xl" />
        <div className="pointer-events-none absolute right-10 bottom-10 size-80 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute inset-y-0 right-[18%] w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

        <div className="relative flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <TrainFront className="size-6" />
          </div>
          <div className="leading-tight">
            <div className="text-lg font-bold tracking-tight">SGR Guardian</div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
              Command Center
            </div>
          </div>
        </div>

        <div className="relative max-w-md">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white/80 ring-1 ring-white/15">
            <span className="size-1.5 rounded-full bg-success animate-pulse" />
            Live · Dar — Dodoma corridor
          </div>
          <h1 className="mt-5 text-4xl xl:text-5xl font-extrabold leading-[1.05] tracking-tight">
            Eyes on every<br />kilometre of rail.
          </h1>
          <p className="mt-4 text-[15px] text-white/70 leading-relaxed">
            One command center for patrol teams, supervisors, incident reports
            and live corridor intelligence across the Tanzania Standard Gauge Railway.
          </p>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-sm">
            <Stat icon={ShieldCheck} value="96%" label="Coverage" />
            <Stat icon={Activity} value="4m 12s" label="Avg response" />
            <Stat icon={TrainFront} value="78" label="On duty" />
          </div>
        </div>

        <div className="relative space-y-4">
          <div className="flex items-center gap-2">
            {BRAND_IMAGES.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Show image ${i + 1}`}
                onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  slide === i ? "w-8 bg-white" : "w-2 bg-white/35 hover:bg-white/60"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center justify-between text-[11px] text-white/50">
            <div>© 2026 Tanzania Railways Corporation</div>
            <div className="flex gap-4">
              <span>Privacy</span>
              <span>Security</span>
              <span>Status</span>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT — Login form */}
      <section className="flex flex-1 items-center justify-center px-6 py-10 lg:px-16">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
              <TrainFront className="size-5" />
            </div>
            <div className="leading-tight">
              <div className="text-base font-bold">SGR Guardian</div>
              <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Command Center
              </div>
            </div>
          </div>

          <div className="mb-1 text-[11px] font-bold uppercase tracking-[0.2em] text-sky">
            Management Access
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Welcome back.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to the corridor command dashboard.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <Field label="Work email">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@sgr.tz"
                className="w-full rounded-xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-sky focus:outline-none focus:ring-4 focus:ring-sky/15 transition"
              />
            </Field>

            <Field
              label="Password"
              right={
                <button type="button" className="text-[11px] font-semibold text-sky hover:underline">
                  Forgot?
                </button>
              }
            >
              <div className="relative">
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-border bg-card px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:border-sky focus:outline-none focus:ring-4 focus:ring-sky/15 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
                  aria-label="Toggle password visibility"
                >
                  {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </Field>

            <label className="flex items-center gap-2 text-[13px] text-muted-foreground select-none">
              <input
                type="checkbox"
                defaultChecked
                className="size-4 rounded border-border accent-[color:var(--primary)]"
              />
              Keep me signed in on this device
            </label>

            <button
              type="submit"
              disabled={loading}
              className="group relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-elevated transition hover:bg-primary-light disabled:opacity-70"
            >
              {loading ? "Signing in…" : "Sign in to command center"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </button>

            <div className="relative my-2">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-3 text-[11px] uppercase tracking-wider text-muted-foreground">
                  Or
                </span>
              </div>
            </div>

            <button
              type="button"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground hover:bg-accent transition"
            >
              <ShieldCheck className="size-4 text-sky" />
              Continue with Single Sign-On (SSO)
            </button>
          </form>

          <p className="mt-8 text-center text-[12px] text-muted-foreground">
            Need access?{" "}
            <Link to="/" className="font-semibold text-primary hover:underline">
              Request a manager account
            </Link>
          </p>
        </div>
      </section>
    </div>
  );
}

function Stat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-2xl bg-white/8 p-3 ring-1 ring-white/10 backdrop-blur">
      <Icon className="size-4 text-sky" />
      <div className="mt-2 text-lg font-extrabold leading-none">{value}</div>
      <div className="mt-1 text-[10px] uppercase tracking-wider text-white/60">{label}</div>
    </div>
  );
}

function Field({
  label,
  right,
  children,
}: {
  label: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between">
        <label className="text-[12px] font-semibold text-foreground">{label}</label>
        {right}
      </div>
      {children}
    </div>
  );
}
