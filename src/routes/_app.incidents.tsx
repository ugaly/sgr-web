import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/sgr/Topbar";
import { IncidentsTable } from "@/components/sgr/IncidentsTable";
import { ReportsChart } from "@/components/sgr/ReportsChart";
import { AlertTriangle, CheckCircle2, Clock, FileWarning } from "lucide-react";

export const Route = createFileRoute("/_app/incidents")({
  head: () => ({ meta: [{ title: "Incidents · SGR Guardian" }] }),
  component: IncidentsPage,
});

const categories = [
  { name: "Trespassing", open: 6, total: 42, pct: 64 },
  { name: "Suspicious activity", open: 3, total: 21, pct: 38 },
  { name: "Vandalism", open: 2, total: 14, pct: 22 },
  { name: "Track obstruction", open: 1, total: 9, pct: 14 },
  { name: "Medical assist", open: 2, total: 12, pct: 18 },
];

function IncidentsPage() {
  return (
    <>
      <Topbar title="Incidents & Reports" eyebrow="All reported events across the corridor" />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Tile icon={FileWarning} label="Open" value="14" tone="warning" />
          <Tile icon={AlertTriangle} label="High priority" value="3" tone="destructive" />
          <Tile icon={Clock} label="Avg resolution" value="38m" tone="sky" />
          <Tile icon={CheckCircle2} label="Resolved (7d)" value="86" tone="success" />
        </section>

        <section className="grid gap-6 grid-cols-1 xl:grid-cols-3">
          <div className="xl:col-span-1"><ReportsChart /></div>
          <div className="xl:col-span-2">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
              <h3 className="text-[15px] font-bold text-foreground">Incidents by category</h3>
              <div className="mt-4 space-y-4">
                {categories.map((c) => (
                  <div key={c.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-semibold text-foreground">{c.name}</span>
                      <span className="text-muted-foreground">{c.open} open · {c.total} total</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-primary to-sky" style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <IncidentsTable />
      </div>
    </>
  );
}

function Tile({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone: string }) {
  const map: Record<string, string> = {
    warning: "bg-warning/10 text-warning",
    destructive: "bg-destructive/10 text-destructive",
    sky: "bg-sky/12 text-sky",
    success: "bg-success/10 text-success",
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
