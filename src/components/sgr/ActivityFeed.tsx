import { ACTIVITY } from "@/lib/sgr-data";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, MoreHorizontal } from "lucide-react";

const TONE = {
  danger: {
    icon: AlertCircle,
    badge: "bg-destructive text-white",
    soft: "bg-destructive/10 text-destructive ring-destructive/20",
    rail: "from-destructive/40 to-destructive/0",
    label: "Critical",
  },
  success: {
    icon: CheckCircle2,
    badge: "bg-success text-white",
    soft: "bg-success/10 text-success ring-success/20",
    rail: "from-success/40 to-success/0",
    label: "Resolved",
  },
  info: {
    icon: Info,
    badge: "bg-info text-white",
    soft: "bg-info/10 text-info ring-info/20",
    rail: "from-info/40 to-info/0",
    label: "Update",
  },
  warning: {
    icon: AlertTriangle,
    badge: "bg-warning text-white",
    soft: "bg-warning/10 text-warning ring-warning/20",
    rail: "from-warning/40 to-warning/0",
    label: "Warning",
  },
} as const;

export function ActivityFeed() {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-soft">
      <header className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div>
          <h3 className="text-[15px] font-bold text-foreground">Activity Timeline</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Live operations stream · auto-refresh</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success ring-1 ring-success/20">
            <span className="relative flex size-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping-slow rounded-full bg-success/60" />
              <span className="relative inline-flex size-1.5 rounded-full bg-success" />
            </span>
            Live
          </span>
          <button className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground">
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </header>

      <ol className="relative px-6 py-5">
        {/* Gradient timeline rail */}
        <span className="absolute left-[39px] top-8 bottom-8 w-[2px] rounded-full bg-gradient-to-b from-border via-border to-transparent" />

        {ACTIVITY.map((a, i) => {
          const t = TONE[a.tone];
          const Icon = t.icon;
          return (
            <li key={a.id} className="relative flex gap-4 pb-5 last:pb-0">
              {/* Node */}
              <div className="relative z-10 shrink-0">
                <div className={`grid size-10 place-items-center rounded-xl ring-[3px] ring-card shadow-soft ${t.badge}`}>
                  <Icon className="size-[18px]" />
                </div>
                {i === 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid size-3.5 place-items-center rounded-full bg-card">
                    <span className="size-2 rounded-full bg-success animate-pulse" />
                  </span>
                )}
              </div>

              {/* Card */}
              <div className="min-w-0 flex-1 rounded-xl border border-border bg-secondary/30 px-4 py-3 transition-colors hover:bg-secondary/60">
                <div className="flex items-center justify-between gap-3">
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ${t.soft}`}>
                    {t.label}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">{a.time}</span>
                </div>
                <p className="mt-1.5 text-[13.5px] leading-snug text-foreground">{a.text}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="border-t border-border px-6 py-3">
        <button className="text-[12px] font-semibold text-primary hover:text-primary-light">
          View full timeline →
        </button>
      </div>
    </section>
  );
}
