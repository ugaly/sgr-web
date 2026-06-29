import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/sgr/Topbar";
import { AlertTriangle, BellRing, Radio, ShieldAlert, CheckCircle2, X } from "lucide-react";

export const Route = createFileRoute("/_app/alerts")({
  head: () => ({ meta: [{ title: "Alerts · SGR Guardian" }] }),
  component: AlertsPage,
});

const alerts = [
  { sev: "critical", title: "SOS triggered — Officer Peter Mhina", where: "Kidete station · KM 287", when: "Just now", by: "Charlie team", note: "Lone officer pressed panic. Auto-dispatch initiated." },
  { sev: "high", title: "Track obstruction detected", where: "KM 312 — between Kidete & Gulwe", when: "8 min ago", by: "Drone sweep", note: "Visual confirms debris on rail. Train SGR-412 advised to slow." },
  { sev: "high", title: "Trespassing group reported", where: "Ruvu sector · KM 96", when: "21 min ago", by: "Field officer Hassan M.", note: "4 individuals near track, retreating." },
  { sev: "medium", title: "Comms degraded", where: "Morogoro relay", when: "44 min ago", by: "System", note: "Switching to backup link, signal stable." },
  { sev: "medium", title: "Camera offline", where: "Soga station — CAM-04", when: "1h ago", by: "System", note: "Investigation dispatched, ETA 25 min." },
  { sev: "low", title: "Shift handover overdue", where: "Bravo team", when: "1h ago", by: "System", note: "Pending check-in from outgoing officer." },
  { sev: "low", title: "Battery low — bodycam", where: "Officer Salma O.", when: "2h ago", by: "Device", note: "12% remaining." },
];

function AlertsPage() {
  return (
    <>
      <Topbar title="Alerts" eyebrow="Live operational signals & escalations" />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Tile icon={ShieldAlert} label="Critical" value="1" tone="destructive" />
          <Tile icon={AlertTriangle} label="High" value="2" tone="warning" />
          <Tile icon={BellRing} label="Medium" value="2" tone="sky" />
          <Tile icon={Radio} label="Low" value="2" tone="muted" />
        </section>

        <div className="flex items-center gap-2">
          {["All", "Critical", "High", "Medium", "Low", "Resolved"].map((f, i) => (
            <button
              key={f}
              className={`rounded-full px-4 py-1.5 text-[12px] font-semibold transition ${
                i === 0
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground hover:bg-accent"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <section className="space-y-3">
          {alerts.map((a, i) => (
            <article key={i} className={`rounded-2xl border bg-card p-5 shadow-soft transition hover:shadow-elevated ${
              a.sev === "critical" ? "border-destructive/40" : "border-border"
            }`}>
              <div className="flex items-start gap-4">
                <SevBadge sev={a.sev} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-[15px] font-bold text-foreground">{a.title}</h3>
                    {a.sev === "critical" && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold text-destructive">
                        <span className="size-1.5 rounded-full bg-destructive animate-pulse" /> LIVE
                      </span>
                    )}
                  </div>
                  <div className="mt-1 text-[13px] text-muted-foreground">{a.where} · {a.when} · {a.by}</div>
                  <p className="mt-2 text-[13px] text-foreground/80">{a.note}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-[12px] font-semibold text-primary-foreground hover:bg-primary-light">
                    <CheckCircle2 className="size-3.5" /> Acknowledge
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-[12px] font-semibold text-muted-foreground hover:bg-accent">
                    <X className="size-3.5" /> Dismiss
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </>
  );
}

function Tile({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone: string }) {
  const map: Record<string, string> = {
    destructive: "bg-destructive/10 text-destructive",
    warning: "bg-warning/10 text-warning",
    sky: "bg-sky/12 text-sky",
    muted: "bg-muted text-muted-foreground",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <div className={`grid size-11 place-items-center rounded-xl ${map[tone]}`}><Icon className="size-5" /></div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-2xl font-extrabold text-foreground">{value}</div>
      </div>
    </div>
  );
}
function SevBadge({ sev }: { sev: string }) {
  const map: Record<string, { bg: string; label: string }> = {
    critical: { bg: "bg-destructive text-white", label: "CRIT" },
    high: { bg: "bg-warning text-white", label: "HIGH" },
    medium: { bg: "bg-sky text-white", label: "MED" },
    low: { bg: "bg-muted text-muted-foreground", label: "LOW" },
  };
  const s = map[sev];
  return (
    <div className={`grid w-14 place-items-center rounded-xl py-2 text-[11px] font-extrabold tracking-wider ${s.bg}`}>
      {s.label}
    </div>
  );
}
