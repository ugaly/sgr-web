import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  X,
  Siren,
  Phone,
  MessageSquare,
  Navigation,
  BatteryWarning,
  MapPin,
  Users,
  Clock,
  ShieldCheck,
  Radio,
  ChevronLeft,
} from "lucide-react";
import { SOS_ALERTS, type SosAlert } from "@/lib/sgr-data";
import { SosMap } from "@/components/sgr/SosMap";

const STATUS_META: Record<SosAlert["status"], string> = {
  Active: "bg-destructive text-white",
  Responding: "bg-warning text-white",
  Resolved: "bg-success text-white",
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

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/45 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex h-[88vh] w-[92vw] max-w-[1280px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-elevated duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {/* Header */}
          <header className="flex shrink-0 items-center gap-3 border-b border-border bg-destructive px-4 py-3 text-white sm:px-5">
            <div className="grid size-9 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25">
              <Siren className="size-4 animate-pulse" />
            </div>
            <div className="min-w-0">
              <DialogPrimitive.Title className="text-[15px] font-extrabold tracking-tight">
                SOS Command
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-[11px] text-white/80">
                {activeSos} active · {SOS_ALERTS.length} signals
              </DialogPrimitive.Description>
            </div>
            <DialogPrimitive.Close className="ml-auto grid size-8 place-items-center rounded-lg bg-white/15 text-white ring-1 ring-white/20 transition hover:bg-white/25">
              <X className="size-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
          </header>

          <div className="grid min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_300px]">
            {/* LEFT — map */}
            <div className="relative min-h-[260px] border-b border-border lg:border-b-0 lg:border-r">
              <SosMap alert={selected ?? undefined} alerts={selected ? undefined : SOS_ALERTS} />
              {selected && (
                <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-2 shadow-soft ring-1 ring-border backdrop-blur">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-destructive">
                    <span className="relative flex size-1.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-destructive/60" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-destructive" />
                    </span>
                    Live
                  </div>
                  <div className="mt-0.5 text-[13px] font-bold text-foreground">{selected.reporter}</div>
                  <div className="text-[10px] text-muted-foreground">{selected.section}</div>
                </div>
              )}
              {!selected && (
                <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-white/95 px-3 py-2 shadow-soft ring-1 ring-border backdrop-blur">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">All signals</div>
                  <div className="mt-0.5 text-[13px] font-bold text-foreground">Select an officer</div>
                </div>
              )}
            </div>

            {/* RIGHT — list or detail */}
            <div className="flex min-h-0 flex-col overflow-hidden">
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

function SosList({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="shrink-0 border-b border-border px-4 py-3">
        <div className="text-[13px] font-bold text-foreground">Distress signals</div>
        <div className="text-[11px] text-muted-foreground">Tap to view details</div>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {SOS_ALERTS.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelect(s.id)}
              className="flex w-full items-center gap-2.5 rounded-xl border border-border bg-card p-2.5 text-left transition hover:border-destructive/30 hover:bg-destructive/5"
            >
              <div className="grid size-8 shrink-0 place-items-center rounded-lg bg-destructive/10 text-[10px] font-bold text-destructive">
                {initials(s.reporter)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[12px] font-semibold text-foreground">{s.reporter}</div>
                <div className="truncate text-[10px] text-muted-foreground">{s.section}</div>
                <div className="text-[10px] text-muted-foreground/80">{s.time}</div>
              </div>
              <span className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${STATUS_META[s.status]}`}>
                {s.status}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function SosDetail({ alert, onBack }: { alert: SosAlert; onBack: () => void }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="shrink-0 border-b border-border px-3 py-2.5">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-primary transition hover:text-primary-light"
        >
          <ChevronLeft className="size-4" /> Back to list
        </button>
      </div>

      <div className="p-3 sm:p-4">
        <div className="flex items-start gap-3">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-destructive/10 text-sm font-extrabold text-destructive ring-2 ring-destructive/10">
            {initials(alert.reporter)}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <h3 className="text-[14px] font-extrabold text-foreground">{alert.reporter}</h3>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${STATUS_META[alert.status]}`}>
                {alert.status}
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground">{alert.role} · {alert.team}</p>
          </div>
        </div>

        <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 p-2.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-destructive">Message</div>
          <p className="mt-1 text-[12px] leading-relaxed text-foreground">{alert.message}</p>
        </div>

        <div className="mt-3 space-y-2">
          <Meta icon={MapPin} label="Location" value={alert.section} />
          <Meta icon={Clock} label="Triggered" value={alert.time} />
          <Meta icon={Users} label="Team" value={alert.team} />
          <Meta
            icon={BatteryWarning}
            label="Battery"
            value={`${alert.battery}%`}
            tone={alert.battery < 20 ? "danger" : undefined}
          />
        </div>

        <div className="mt-4 space-y-2">
          <a
            href={`tel:${alert.phone}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-destructive px-3 py-2 text-[12px] font-semibold text-white transition hover:bg-destructive/90"
          >
            <Phone className="size-3.5" /> Call officer
          </a>
          <div className="grid grid-cols-2 gap-1.5">
            <button className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-2 py-2 text-[11px] font-semibold text-foreground transition hover:bg-secondary">
              <MessageSquare className="size-3.5" /> Message
            </button>
            <button className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-2 py-2 text-[11px] font-semibold text-foreground transition hover:bg-secondary">
              <Navigation className="size-3.5 text-sky" /> Dispatch
            </button>
            <button className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-2 py-2 text-[11px] font-semibold text-foreground transition hover:bg-secondary">
              <Radio className="size-3.5 text-primary" /> Broadcast
            </button>
            <button className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-success px-2 py-2 text-[11px] font-semibold text-white transition hover:bg-success/90">
              <ShieldCheck className="size-3.5" /> Resolve
            </button>
          </div>
        </div>
      </div>
    </div>
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
  tone?: "danger";
}) {
  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-secondary/40 px-2.5 py-2">
      <div className={`grid size-6 shrink-0 place-items-center rounded-md ${tone === "danger" ? "bg-destructive/10 text-destructive" : "bg-card text-muted-foreground"}`}>
        <Icon className="size-3" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[9px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className={`truncate text-[12px] font-semibold ${tone === "danger" ? "text-destructive" : "text-foreground"}`}>{value}</div>
      </div>
    </div>
  );
}
