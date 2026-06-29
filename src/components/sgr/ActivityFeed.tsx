import { ACTIVITY } from "@/lib/sgr-data";
import { AlertCircle, CheckCircle2, Info, AlertTriangle, MoreHorizontal } from "lucide-react";

const TONE = {
  danger: {
    icon: AlertCircle,
    node: "border-destructive/30 bg-destructive/8 text-destructive",
    dot: "bg-destructive",
  },
  success: {
    icon: CheckCircle2,
    node: "border-success/30 bg-success/8 text-success",
    dot: "bg-success",
  },
  info: {
    icon: Info,
    node: "border-info/30 bg-info/8 text-info",
    dot: "bg-info",
  },
  warning: {
    icon: AlertTriangle,
    node: "border-warning/30 bg-warning/8 text-warning",
    dot: "bg-warning",
  },
} as const;

export function ActivityFeed() {
  return (
    <section className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-soft backdrop-blur-md">
      <header className="flex items-center justify-between border-b border-border/70 px-6 py-5 glass-tint">
        <div>
          <h3 className="text-[15px] font-bold text-foreground">Activity Timeline</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">Live operations stream</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success">
            <span className="size-1.5 rounded-full bg-success" />
            Live
          </span>
          <button className="grid size-8 place-items-center rounded-full border border-border bg-card text-muted-foreground transition hover:bg-secondary hover:text-foreground">
            <MoreHorizontal className="size-4" />
          </button>
        </div>
      </header>

      <ol className="relative flex-1 overflow-y-auto px-5 py-5">
        {ACTIVITY.map((a, i) => {
          const t = TONE[a.tone];
          const Icon = t.icon;
          const isLast = i === ACTIVITY.length - 1;
          const isLatest = i === 0;

          return (
            <li key={a.id} className="relative flex gap-4 pb-0 last:pb-0">
              {/* Stepper column */}
              <div className="flex w-9 shrink-0 flex-col items-center">
                <div
                  className={`relative z-10 grid size-9 place-items-center rounded-full border bg-card shadow-soft ${t.node}`}
                >
                  <Icon className="size-[15px] stroke-[2.25]" />
                  {isLatest && (
                    <span className={`absolute -right-0.5 -top-0.5 size-2 rounded-full ${t.dot} ring-2 ring-card`} />
                  )}
                </div>
                {!isLast && (
                  <div className="my-1 w-px flex-1 min-h-[28px] bg-border" aria-hidden />
                )}
              </div>

              {/* Content */}
              <div
                className={`mb-4 min-w-0 flex-1 rounded-xl border px-3.5 py-3 transition-colors ${
                  isLatest
                    ? "border-primary/15 bg-accent/50 shadow-soft"
                    : "border-transparent bg-transparent hover:border-border/80 hover:bg-secondary/40"
                }`}
              >
                <div className="flex items-baseline justify-between gap-3">
                  <span className="text-[12px] font-semibold text-foreground">{a.time}</span>
                  {isLatest && (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
                      Latest
                    </span>
                  )}
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-foreground/90">{a.text}</p>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="border-t border-border/70 px-6 py-3 glass-tint">
        <button className="text-[12px] font-semibold text-primary transition hover:text-primary-light">
          View full timeline →
        </button>
      </div>
    </section>
  );
}
