import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/sgr/Topbar";
import { AlertsList } from "@/components/sgr/AlertsList";
import { ALERTS } from "@/lib/sgr-data";
import { ShieldAlert, AlertTriangle, BellRing, Radio } from "lucide-react";

export const Route = createFileRoute("/_app/alerts")({
  head: () => ({ meta: [{ title: "Alerts · SGR Guardian" }] }),
  component: AlertsPage,
});

function AlertsPage() {
  const open = ALERTS.filter((a) => a.status !== "resolved");
  const critical = open.filter((a) => a.severity === "critical").length;
  const high = open.filter((a) => a.severity === "high").length;
  const medium = open.filter((a) => a.severity === "medium").length;
  const low = open.filter((a) => a.severity === "low").length;

  return (
    <>
      <Topbar title="Alerts" eyebrow="Live operational signals & escalations" />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <Tile icon={ShieldAlert} label="Critical" value={String(critical)} tone="destructive" />
          <Tile icon={AlertTriangle} label="High" value={String(high)} tone="warning" />
          <Tile icon={BellRing} label="Medium" value={String(medium)} tone="sky" />
          <Tile icon={Radio} label="Low" value={String(low)} tone="muted" />
        </section>

        <AlertsList />
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
