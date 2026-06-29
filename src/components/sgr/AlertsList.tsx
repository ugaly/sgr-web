import { useMemo, useState } from "react";
import {
  Search,
  Siren,
  TrainFront,
  ShieldAlert,
  Radio,
  Smartphone,
  ClipboardList,
  MapPin,
  Clock,
  User,
  CheckCircle2,
  X,
  ChevronDown,
  Eye,
  BellRing,
} from "lucide-react";
import { ALERTS, type AlertItem, type AlertSeverity, type AlertStatus } from "@/lib/sgr-data";
import { cn } from "@/lib/utils";

type Filter = "all" | AlertSeverity | "resolved";

const SEVERITY: Record<
  AlertSeverity,
  { label: string; badge: string; icon: string; ring: string; featured?: boolean }
> = {
  critical: {
    label: "Critical",
    badge: "bg-destructive text-white",
    icon: "bg-destructive/10 text-destructive ring-destructive/20",
    ring: "ring-destructive/30",
  },
  high: {
    label: "High",
    badge: "bg-warning text-white",
    icon: "bg-warning/10 text-warning ring-warning/20",
    ring: "ring-warning/30",
  },
  medium: {
    label: "Medium",
    badge: "bg-sky text-white",
    icon: "bg-sky/15 text-primary ring-sky/25",
    ring: "ring-sky/30",
  },
  low: {
    label: "Low",
    badge: "bg-secondary text-muted-foreground",
    icon: "bg-secondary text-muted-foreground ring-border",
    ring: "ring-border",
  },
};

const STATUS: Record<AlertStatus, { label: string; cls: string }> = {
  active: { label: "Active", cls: "bg-destructive/10 text-destructive" },
  acknowledged: { label: "Acknowledged", cls: "bg-warning/10 text-warning" },
  resolved: { label: "Resolved", cls: "bg-success/10 text-success" },
};

const CATEGORY_ICON = {
  sos: Siren,
  infrastructure: TrainFront,
  security: ShieldAlert,
  comms: Radio,
  device: Smartphone,
  ops: ClipboardList,
} as const;

const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "critical", label: "Critical" },
  { key: "high", label: "High" },
  { key: "medium", label: "Medium" },
  { key: "low", label: "Low" },
  { key: "resolved", label: "Resolved" },
];

export function AlertsList() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [items, setItems] = useState(ALERTS);

  const counts = useMemo(
    () => ({
      critical: items.filter((a) => a.severity === "critical" && a.status !== "resolved").length,
      high: items.filter((a) => a.severity === "high" && a.status !== "resolved").length,
      medium: items.filter((a) => a.severity === "medium" && a.status !== "resolved").length,
      low: items.filter((a) => a.severity === "low" && a.status !== "resolved").length,
      unread: items.filter((a) => a.unread).length,
    }),
    [items],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((a) => {
      const matchFilter =
        filter === "all"
          ? true
          : filter === "resolved"
          ? a.status === "resolved"
          : a.severity === filter && a.status !== "resolved";
      const matchSearch =
        !q ||
        [a.title, a.location, a.source, a.note, a.category].some((v) => v.toLowerCase().includes(q));
      return matchFilter && matchSearch;
    });
  }, [items, filter, search]);

  function acknowledge(id: string) {
    setItems((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "acknowledged" as const, unread: false } : a,
      ),
    );
  }

  function dismiss(id: string) {
    setItems((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status: "resolved" as const, unread: false } : a,
      ),
    );
  }

  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
      {/* Toolbar */}
      <header className="border-b border-border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4">
          <div>
            <h3 className="text-[15px] font-bold text-foreground">Operational alerts</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {filtered.length} shown · {counts.unread} unread
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search alerts…"
              className="w-full rounded-lg border border-border bg-card py-2 pl-9 pr-3 text-[13px] placeholder:text-muted-foreground transition focus:border-ring focus:outline-none focus:ring-4 focus:ring-ring/10"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 border-t border-border/60 px-5 py-3">
          {FILTERS.map((f) => {
            const active = filter === f.key;
            const count =
              f.key === "all"
                ? items.length
                : f.key === "resolved"
                ? items.filter((a) => a.status === "resolved").length
                : items.filter((a) => a.severity === f.key && a.status !== "resolved").length;
            return (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[12px] font-semibold transition",
                  active
                    ? "bg-primary text-primary-foreground shadow-soft"
                    : "border border-border bg-card text-foreground hover:bg-secondary",
                )}
              >
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                    active ? "bg-white/20" : "bg-secondary text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </header>

      {/* List */}
      <div className="divide-y divide-border/70">
        {filtered.length === 0 ? (
          <div className="grid place-items-center gap-2 px-6 py-16 text-center">
            <BellRing className="size-8 text-muted-foreground/50" />
            <p className="text-sm font-semibold text-foreground">No alerts match</p>
            <p className="text-xs text-muted-foreground">Try a different filter or search term</p>
          </div>
        ) : (
          filtered.map((alert) => (
            <AlertRow
              key={alert.id}
              alert={alert}
              expanded={expandedId === alert.id}
              onToggle={() => setExpandedId((id) => (id === alert.id ? null : alert.id))}
              onAcknowledge={() => acknowledge(alert.id)}
              onDismiss={() => dismiss(alert.id)}
            />
          ))
        )}
      </div>
    </section>
  );
}

function AlertRow({
  alert,
  expanded,
  onToggle,
  onAcknowledge,
  onDismiss,
}: {
  alert: AlertItem;
  expanded: boolean;
  onToggle: () => void;
  onAcknowledge: () => void;
  onDismiss: () => void;
}) {
  const sev = SEVERITY[alert.severity];
  const stat = STATUS[alert.status];
  const Icon = CATEGORY_ICON[alert.category];
  const isLive = alert.severity === "critical" && alert.status === "active";

  return (
    <article
      className={cn(
        "group transition-colors",
        alert.unread && "bg-accent/25",
        isLive && "bg-destructive/[0.03]",
        expanded && "bg-secondary/30",
      )}
    >
      <div className="flex items-start gap-3 px-4 py-4 sm:gap-4 sm:px-5">
        {/* Severity icon */}
        <div className="relative shrink-0 pt-0.5">
          <div
            className={cn(
              "grid size-11 place-items-center rounded-xl ring-1",
              sev.icon,
              sev.ring,
            )}
          >
            <Icon className="size-5" />
          </div>
          {isLive && (
            <span className="absolute -right-0.5 -top-0.5 size-3 rounded-full bg-destructive ring-2 ring-card">
              <span className="absolute inset-0 animate-ping rounded-full bg-destructive opacity-70" />
            </span>
          )}
          {alert.unread && !isLive && (
            <span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full bg-primary ring-2 ring-card" />
          )}
        </div>

        {/* Content */}
        <button
          type="button"
          onClick={onToggle}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-[14px] font-bold text-foreground">{alert.title}</h4>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide", sev.badge)}>
              {sev.label}
            </span>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", stat.cls)}>
              {stat.label}
            </span>
            {isLive && (
              <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
                <span className="size-1.5 rounded-full bg-destructive animate-pulse" />
                LIVE
              </span>
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="size-3 shrink-0" /> {alert.location}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3 shrink-0" /> {alert.time}
            </span>
            <span className="inline-flex items-center gap-1">
              <User className="size-3 shrink-0" /> {alert.source}
            </span>
          </div>

          <p className={cn("mt-2 text-[13px] leading-relaxed text-foreground/85", !expanded && "line-clamp-2")}>
            {alert.note}
          </p>

          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-primary">
            {expanded ? "Show less" : "View details"}
            <ChevronDown className={cn("size-3.5 transition", expanded && "rotate-180")} />
          </span>
        </button>

        {/* Actions */}
        {alert.status !== "resolved" && (
          <div className="hidden shrink-0 flex-col gap-1.5 sm:flex">
            <button
              onClick={onAcknowledge}
              disabled={alert.status === "acknowledged"}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[11px] font-semibold text-primary-foreground transition hover:bg-primary-light disabled:cursor-default disabled:opacity-50"
            >
              <CheckCircle2 className="size-3.5" /> Acknowledge
            </button>
            <button
              onClick={onDismiss}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[11px] font-semibold text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              <X className="size-3.5" /> Dismiss
            </button>
          </div>
        )}
      </div>

      {/* Expanded panel */}
      {expanded && (
        <div className="border-t border-border bg-secondary/30 px-4 py-4 sm:px-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Detail label="Category" value={alert.category.replace("_", " ")} />
            <Detail label="Severity" value={sev.label} />
            <Detail label="Status" value={stat.label} />
            <Detail label="Source" value={alert.source} />
          </div>
          <div className="mt-3 rounded-xl border border-border bg-secondary/40 p-3">
            <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Full note</div>
            <p className="mt-1 text-[13px] leading-relaxed text-foreground">{alert.note}</p>
          </div>
          {alert.status !== "resolved" && (
            <div className="mt-3 flex flex-wrap gap-2 sm:hidden">
              <button
                onClick={onAcknowledge}
                disabled={alert.status === "acknowledged"}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[12px] font-semibold text-primary-foreground disabled:opacity-50"
              >
                <CheckCircle2 className="size-3.5" /> Acknowledge
              </button>
              <button
                onClick={onDismiss}
                className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[12px] font-semibold text-muted-foreground"
              >
                <X className="size-3.5" /> Dismiss
              </button>
            </div>
          )}
          {alert.status === "resolved" && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-success/10 px-3 py-2 text-[12px] font-semibold text-success">
              <Eye className="size-3.5" /> This alert has been resolved
            </div>
          )}
        </div>
      )}
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 text-[13px] font-semibold capitalize text-foreground">{value}</div>
    </div>
  );
}
