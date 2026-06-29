import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  X,
  Siren,
  Phone,
  MessageSquare,
  Navigation,
  BatteryWarning,
  BatteryFull,
  MapPin,
  Users,
  Clock,
  ShieldCheck,
  Radio,
  ChevronLeft,
  Signal,
  CircleDot,
  Crosshair,
} from "lucide-react";
import { SOS_ALERTS, type SosAlert } from "@/lib/sgr-data";
import { SosMap } from "@/components/sgr/SosMap";

const STATUS_META: Record<SosAlert["status"], { badge: string; dot: string; label: string }> = {
  Active:     { badge: "bg-destructive text-white", dot: "bg-destructive", label: "Active" },
  Responding: { badge: "bg-warning text-white",     dot: "bg-warning",     label: "Responding" },
  Resolved:   { badge: "bg-success text-white",     dot: "bg-success",     label: "Resolved" },
};

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();
}

export function SosModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (open) setSelectedId(null);
  }, [open]);

  const selected = selectedId ? SOS_ALERTS.find((s) => s.id === selectedId) : null;
  const activeSos = SOS_ALERTS.filter((s) => s.status === "Active").length;
  const responding = SOS_ALERTS.filter((s) => s.status === "Responding").length;

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/55 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 m-auto flex h-[96vh] w-[97vw] max-w-[1600px] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-elevated duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {/* Header */}
          <header className="relative flex shrink-0 items-center gap-3 overflow-hidden border-b border-border bg-gradient-to-r from-destructive via-[#d63422] to-[#b01608] px-5 py-3.5 text-white sm:px-6">
            <div className="pointer-events-none absolute -right-10 -top-10 size-40 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-12 left-1/3 size-40 rounded-full bg-black/10 blur-2xl" />
            <div className="relative grid size-11 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25 backdrop-blur">
              <Siren className="size-5 animate-pulse" />
            </div>
            <div className="relative min-w-0">
              <DialogPrimitive.Title className="text-[17px] font-extrabold tracking-tight">
                SOS Command Center
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-[12px] text-white/80">
                Real-time distress monitoring · Dar — Dodoma corridor
              </DialogPrimitive.Description>
            </div>

            {/* Live stat chips */}
            <div className="relative ml-auto hidden items-center gap-2 sm:flex">
              <HeaderChip dot="bg-white" label="Active" value={activeSos} pulse />
              <HeaderChip dot="bg-white/70" label="Responding" value={responding} />
              <HeaderChip dot="bg-white/40" label="Total" value={SOS_ALERTS.length} />
            </div>

            <DialogPrimitive.Close className="relative ml-2 grid size-9 place-items-center rounded-lg bg-white/15 text-white ring-1 ring-white/20 transition hover:bg-white/25">
              <X className="size-[18px]" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </header>

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_400px]">
            {/* LEFT — map */}
            <div className="relative min-h-[280px] border-b border-border lg:border-b-0 lg:border-r">
              <SosMap alert={selected ?? undefined} alerts={selected ? undefined : SOS_ALERTS} />

              {/* Floating context card */}
              <div className="pointer-events-none absolute left-4 top-4 flex flex-col gap-2">
                <div className="glass-panel-strong rounded-xl px-4 py-3 shadow-elevated ring-1 ring-border/80">
                  {selected ? (
                    <>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-destructive">
                        <span className="relative flex size-1.5">
                          <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive/60" />
                          <span className="relative inline-flex size-1.5 rounded-full bg-destructive" />
                        </span>
                        Live tracking
                      </div>
                      <div className="mt-1 text-[14px] font-extrabold text-foreground">{selected.reporter}</div>
                      <div className="text-[11px] text-muted-foreground">{selected.section}</div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                        <Crosshair className="size-3 text-primary" /> Corridor overview
                      </div>
                      <div className="mt-1 text-[14px] font-extrabold text-foreground">{SOS_ALERTS.length} distress signals</div>
                      <div className="text-[11px] text-muted-foreground">Select a signal to track</div>
                    </>
                  )}
                </div>
              </div>

              {/* Legend */}
              <div className="pointer-events-none absolute bottom-4 left-4 glass-panel rounded-lg px-3 py-2 text-[11px] shadow-soft ring-1 ring-border/70">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-destructive" /> SOS</span>
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-primary" /> Train</span>
                  <span className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-sky" /> Station</span>
                </div>
              </div>
            </div>

            {/* RIGHT — list or detail */}
            <div className="flex min-h-0 flex-col overflow-hidden bg-card/50">
              {selected ? (
                <SosDetail alert={selected} onBack={() => setSelectedId(null)} />
              ) : (
                <SosList onSelect={setSelectedId} />
              )}
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function HeaderChip({ dot, label, value, pulse }: { dot: string; label: string; value: number; pulse?: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 ring-1 ring-white/20 backdrop-blur">
      <span className="relative flex size-2">
        {pulse && <span className={`absolute inline-flex size-full animate-ping rounded-full ${dot} opacity-70`} />}
        <span className={`relative inline-flex size-2 rounded-full ${dot}`} />
      </span>
      <span className="text-[11px] font-medium text-white/85">{label}</span>
      <span className="text-[13px] font-extrabold tabular-nums">{value}</span>
    </div>
  );
}

function SosList({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border px-5 py-4">
        <div className="text-[14px] font-extrabold text-foreground">Distress signals</div>
        <div className="text-[12px] text-muted-foreground">Select an officer to open the live case</div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="space-y-2.5">
          {SOS_ALERTS.map((s) => {
            const meta = STATUS_META[s.status];
            const lowBattery = s.battery < 20;
            return (
              <button
                key={s.id}
                onClick={() => onSelect(s.id)}
                className="group flex w-full items-center gap-3 rounded-xl border border-border bg-card p-3 text-left shadow-soft transition hover:-translate-y-0.5 hover:border-destructive/40 hover:shadow-elevated"
              >
                <div className="relative shrink-0">
                  <div className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-destructive/15 to-destructive/5 text-[12px] font-extrabold text-destructive ring-1 ring-destructive/15">
                    {initials(s.reporter)}
                  </div>
                  <span className={`absolute -bottom-1 -right-1 size-3.5 rounded-full ring-2 ring-card ${meta.dot}`}>
                    {s.status === "Active" && <span className="absolute inset-0 animate-ping rounded-full bg-destructive opacity-70" />}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="truncate text-[13.5px] font-bold text-foreground">{s.reporter}</div>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.badge}`}>
                      {meta.label}
                    </span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-muted-foreground">
                    <MapPin className="size-3" /> <span className="truncate">{s.section}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-muted-foreground/90">
                    <span className="flex items-center gap-1"><Clock className="size-3" /> {s.time}</span>
                    <span className={`flex items-center gap-1 ${lowBattery ? "font-bold text-destructive" : ""}`}>
                      <BatteryWarning className="size-3" /> {s.battery}%
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SosDetail({ alert, onBack }: { alert: SosAlert; onBack: () => void }) {
  const meta = STATUS_META[alert.status];
  const lowBattery = alert.battery < 20;

  const timeline = [
    { label: "Signal received", time: alert.time, done: true, tone: "danger" as const },
    { label: "Supervisor notified", time: "+30s", done: alert.status !== "Active", tone: "warning" as const },
    { label: "Unit dispatched", time: "+2m", done: alert.status === "Responding" || alert.status === "Resolved", tone: "info" as const },
    { label: "Resolved", time: "—", done: alert.status === "Resolved", tone: "success" as const },
  ];

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Back bar */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-3">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[12.5px] font-semibold text-primary transition hover:bg-secondary"
        >
          <ChevronLeft className="size-4" /> All signals
        </button>
        <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <Signal className="size-3.5 text-success" /> Connection stable
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
        {/* Hero */}
        <div className="rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="flex items-start gap-3.5">
            <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-destructive to-[#b01608] text-base font-extrabold text-white shadow-soft ring-2 ring-destructive/20">
              {initials(alert.reporter)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-[16px] font-extrabold text-foreground">{alert.reporter}</h3>
                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${meta.badge}`}>
                  <CircleDot className="size-2.5" /> {meta.label}
                </span>
              </div>
              <p className="mt-0.5 text-[12px] text-muted-foreground">{alert.role} · {alert.team}</p>
              <p className="mt-1 font-mono text-[12px] font-semibold text-foreground">{alert.phone}</p>
            </div>
          </div>
        </div>

        {/* Critical message */}
        <div className="mt-3 overflow-hidden rounded-2xl border border-destructive/25 bg-destructive/5">
          <div className="flex items-center gap-1.5 border-b border-destructive/15 bg-destructive/10 px-3.5 py-2 text-[10px] font-bold uppercase tracking-wider text-destructive">
            <Siren className="size-3.5" /> Distress message
          </div>
          <p className="px-3.5 py-3 text-[13px] leading-relaxed text-foreground">{alert.message}</p>
        </div>

        {/* Metadata grid */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <Meta icon={MapPin} label="Location" value={alert.section} />
          <Meta icon={Clock} label="Triggered" value={alert.time} />
          <Meta icon={Users} label="Team" value={alert.team} />
          <Meta
            icon={lowBattery ? BatteryWarning : BatteryFull}
            label="Battery"
            value={`${alert.battery}%`}
            tone={lowBattery ? "danger" : "success"}
          />
        </div>

        {/* Response timeline */}
        <div className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-soft">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Response timeline</div>
          <ol className="relative space-y-3.5">
            <span className="absolute bottom-2 left-[7px] top-2 w-px bg-border" />
            {timeline.map((s) => {
              const doneColor =
                s.tone === "danger" ? "bg-destructive"
                : s.tone === "warning" ? "bg-warning"
                : s.tone === "info" ? "bg-info"
                : "bg-success";
              return (
                <li key={s.label} className="relative flex items-center gap-3">
                  <span className={`relative z-10 size-3.5 shrink-0 rounded-full ring-2 ring-card ${s.done ? doneColor : "bg-border"}`} />
                  <span className={`flex-1 text-[12.5px] ${s.done ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {s.label}
                  </span>
                  <span className="text-[11px] font-medium text-muted-foreground">{s.time}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Sticky action bar */}
      <div className="shrink-0 border-t border-border bg-card/80 p-3 backdrop-blur-md">
        <a
          href={`tel:${alert.phone}`}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-destructive px-3 py-3 text-[13px] font-bold text-white shadow-soft transition hover:bg-destructive/90"
        >
          <Phone className="size-4" /> Call {alert.reporter.split(" ")[0]} now
        </a>
        <div className="mt-2 grid grid-cols-3 gap-2">
          <ActionBtn icon={MessageSquare} label="Message" />
          <ActionBtn icon={Navigation} label="Dispatch" iconClass="text-sky" />
          <ActionBtn icon={Radio} label="Broadcast" iconClass="text-primary" />
        </div>
        <button className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-success px-3 py-2.5 text-[12.5px] font-bold text-white transition hover:bg-success/90">
          <ShieldCheck className="size-4" /> Mark resolved
        </button>
      </div>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  iconClass = "text-foreground",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  iconClass?: string;
}) {
  return (
    <button className="inline-flex flex-col items-center justify-center gap-1 rounded-xl border border-border bg-card px-2 py-2.5 text-[11px] font-semibold text-foreground shadow-soft transition hover:-translate-y-0.5 hover:bg-secondary hover:shadow-elevated">
      <Icon className={`size-4 ${iconClass}`} />
      {label}
    </button>
  );
}

function Meta({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  tone?: "danger" | "success";
}) {
  const toneCls =
    tone === "danger"
      ? "bg-destructive/10 text-destructive"
      : tone === "success"
      ? "bg-success/10 text-success"
      : "bg-secondary text-muted-foreground";
  const valCls = tone === "danger" ? "text-destructive" : "text-foreground";
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3 py-2.5 shadow-soft">
      <div className={`grid size-8 shrink-0 place-items-center rounded-lg ${toneCls}`}>
        <Icon className="size-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className={`truncate text-[13px] font-bold ${valCls}`}>{value}</div>
      </div>
    </div>
  );
}
