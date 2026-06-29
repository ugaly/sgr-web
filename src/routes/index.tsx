import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  TrainFront,
  ShieldCheck,
  Eye,
  EyeOff,
  X,
  Activity,
  Users,
} from "lucide-react";
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

const WEEK = [
  { d: "Sun", n: 22 },
  { d: "Mon", n: 23 },
  { d: "Tue", n: 24 },
  { d: "Wed", n: 25, active: true },
  { d: "Thu", n: 26 },
  { d: "Fri", n: 27 },
  { d: "Sat", n: 28 },
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
    <div className="flex min-h-screen items-center justify-center bg-[#aeb4c0] p-4 sm:p-6 lg:p-8">
      <div className="grid w-full max-w-[1080px] overflow-hidden rounded-[28px] bg-card shadow-elevated lg:grid-cols-2">
        {/* LEFT — Form */}
        <section className="relative flex flex-col bg-gradient-to-br from-secondary/60 via-card to-accent/40 px-6 py-8 sm:px-10 lg:px-12">
          <div className="flex items-center gap-2.5">
            <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <TrainFront className="size-5" />
            </div>
            <span className="text-[15px] font-bold tracking-tight text-foreground">SGR Guardian</span>
          </div>

          <div className="flex flex-1 flex-col justify-center py-8">
            <div className="mx-auto w-full max-w-sm">
              <h1 className="text-center text-3xl font-extrabold tracking-tight text-foreground">
                Welcome back
              </h1>
              <p className="mt-2 text-center text-[13px] text-muted-foreground">
                Sign in to the corridor command center
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <Field label="Work email">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@sgr.tz"
                    className="w-full rounded-xl border border-border bg-card/70 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-sky focus:bg-card focus:outline-none focus:ring-4 focus:ring-sky/15"
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
                      className="w-full rounded-xl border border-border bg-card/70 px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-sky focus:bg-card focus:outline-none focus:ring-4 focus:ring-sky/15"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-muted-foreground hover:bg-muted"
                      aria-label="Toggle password visibility"
                    >
                      {showPwd ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </Field>

                <label className="flex select-none items-center gap-2 text-[13px] text-muted-foreground">
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
                  className="mt-1 w-full rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground shadow-soft transition hover:bg-primary-light disabled:opacity-70"
                >
                  {loading ? "Signing in…" : "Sign in"}
                </button>
              </form>
            </div>
          </div>

          <div className="flex items-center justify-between text-[12px] text-muted-foreground">
            <span>
              Need access?{" "}
              <Link to="/" className="font-semibold text-primary hover:underline">
                Request account
              </Link>
            </span>
            <Link to="/" className="font-medium underline hover:text-foreground">
              Terms &amp; Conditions
            </Link>
          </div>
        </section>

        {/* RIGHT — Photo slideshow with floating cards */}
        <section className="relative hidden min-h-[560px] overflow-hidden rounded-[24px] lg:m-2 lg:block">
          {BRAND_IMAGES.map((src, i) => (
            <div
              key={src}
              aria-hidden
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('${src}')`,
                opacity: slide === i ? 1 : 0,
                transform: slide === i ? "scale(1.06)" : "scale(1)",
                transition: "opacity 1500ms ease-in-out, transform 6000ms ease-out",
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-deep/70 via-primary/10 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/25 to-transparent" />

          {/* Close */}
          <div className="absolute right-4 top-4 grid size-9 place-items-center rounded-full bg-white/90 text-foreground shadow-soft">
            <X className="size-4" />
          </div>

          {/* Top floating card — live shift */}
          <div className="absolute left-5 top-5 w-[230px] rounded-2xl bg-white/85 p-3 shadow-elevated ring-1 ring-white/40 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-primary">
                <ShieldCheck className="size-4" />
              </span>
              <div className="min-w-0">
                <div className="text-[12px] font-bold text-foreground">Corridor shift brief</div>
                <div className="text-[10px] text-muted-foreground">06:00 – 18:00 EAT</div>
              </div>
            </div>
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">
              <span className="size-1.5 rounded-full bg-success" /> Live · Dar — Dodoma
            </div>
          </div>

          {/* Week strip */}
          <div className="absolute inset-x-5 top-[44%] flex justify-between rounded-2xl bg-white/15 px-3 py-3 text-white backdrop-blur-sm ring-1 ring-white/20">
            {WEEK.map((w) => (
              <div key={w.d} className="text-center">
                <div className="text-[10px] font-medium text-white/70">{w.d}</div>
                <div
                  className={`mt-1 grid size-7 place-items-center rounded-full text-[12px] font-bold ${
                    w.active ? "bg-white text-primary" : "text-white"
                  }`}
                >
                  {w.n}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom floating card — stats */}
          <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 p-4 shadow-elevated ring-1 ring-white/40 backdrop-blur-md">
            <div className="text-[12px] font-bold text-foreground">Live operations</div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              <MiniStat icon={ShieldCheck} value="96%" label="Coverage" />
              <MiniStat icon={Activity} value="4m12s" label="Response" />
              <MiniStat icon={Users} value="78" label="On duty" />
            </div>
          </div>

          {/* Slide dots */}
          <div className="absolute bottom-[104px] left-1/2 flex -translate-x-1/2 items-center gap-2">
            {BRAND_IMAGES.map((src, i) => (
              <button
                key={src}
                type="button"
                aria-label={`Show image ${i + 1}`}
                onClick={() => setSlide(i)}
                className={`h-1.5 rounded-full transition-all duration-500 ${
                  slide === i ? "w-7 bg-white" : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MiniStat({
  icon: Icon,
  value,
  label,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-secondary/60 p-2.5 text-center">
      <Icon className="mx-auto size-4 text-primary" />
      <div className="mt-1 text-[14px] font-extrabold leading-none text-foreground">{value}</div>
      <div className="mt-0.5 text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
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
