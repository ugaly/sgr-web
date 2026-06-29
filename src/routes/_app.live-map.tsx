import { createFileRoute } from "@tanstack/react-router";
import { Topbar } from "@/components/sgr/Topbar";
import { RailwayMap } from "@/components/sgr/RailwayMap";
import { ActivityFeed } from "@/components/sgr/ActivityFeed";
import { TrainFront, MapPin, Radio, Users } from "lucide-react";

export const Route = createFileRoute("/_app/live-map")({
  head: () => ({ meta: [{ title: "Live Map · SGR Guardian" }] }),
  component: LiveMapPage,
});

const trains = [
  { id: "SGR-101", route: "Dar → Dodoma", speed: "112 km/h", status: "On time", next: "Morogoro · 22 min" },
  { id: "SGR-204", route: "Dodoma → Dar", speed: "98 km/h", status: "On time", next: "Kilosa · 14 min" },
  { id: "SGR-307", route: "Dar → Morogoro", speed: "0 km/h", status: "At station", next: "Departs 16:45" },
  { id: "SGR-412", route: "Dodoma → Makutupora", speed: "76 km/h", status: "Delayed 6m", next: "Bahi · 31 min" },
];

const stations = [
  { name: "Dar es Salaam Central", officers: 12, status: "Secure" },
  { name: "Pugu", officers: 6, status: "Secure" },
  { name: "Soga", officers: 4, status: "Secure" },
  { name: "Ruvu", officers: 5, status: "Patrol" },
  { name: "Ngerengere", officers: 4, status: "Secure" },
  { name: "Morogoro", officers: 9, status: "Patrol" },
  { name: "Kilosa", officers: 6, status: "Secure" },
  { name: "Kidete", officers: 3, status: "Alert" },
  { name: "Gulwe", officers: 4, status: "Secure" },
  { name: "Dodoma", officers: 11, status: "Secure" },
];

function LiveMapPage() {
  return (
    <>
      <Topbar title="Live Corridor Map" eyebrow="Real-time train + field officer telemetry" />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <MiniStat icon={TrainFront} label="Active trains" value="6" tone="primary" />
          <MiniStat icon={Users} label="Field officers" value="78" tone="sky" />
          <MiniStat icon={MapPin} label="Stations covered" value="10/10" tone="success" />
          <MiniStat icon={Radio} label="Live signals" value="142/s" tone="warning" />
        </section>

        <section className="grid gap-6 grid-cols-1 xl:grid-cols-3">
          <div className="xl:col-span-2"><RailwayMap /></div>
          <div className="xl:col-span-1"><ActivityFeed /></div>
        </section>

        <section className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          <Card title="Trains in motion">
            <div className="divide-y divide-border">
              {trains.map((t) => (
                <div key={t.id} className="flex items-center gap-3 py-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-primary/8 text-primary">
                    <TrainFront className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-foreground">{t.id} <span className="text-muted-foreground font-normal">· {t.route}</span></div>
                    <div className="text-[12px] text-muted-foreground">{t.next}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-foreground">{t.speed}</div>
                    <div className={`text-[11px] font-semibold ${t.status.includes("Delayed") ? "text-warning" : t.status === "At station" ? "text-sky" : "text-success"}`}>{t.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Station coverage">
            <div className="divide-y divide-border">
              {stations.map((s) => (
                <div key={s.name} className="flex items-center gap-3 py-3">
                  <MapPin className="size-4 text-sky" />
                  <div className="flex-1 text-sm font-medium text-foreground">{s.name}</div>
                  <div className="text-[12px] text-muted-foreground">{s.officers} officers</div>
                  <Pill status={s.status} />
                </div>
              ))}
            </div>
          </Card>
        </section>
      </div>
    </>
  );
}

function MiniStat({ icon: Icon, label, value, tone }: { icon: any; label: string; value: string; tone: string }) {
  const map: Record<string, string> = {
    primary: "bg-primary/8 text-primary",
    sky: "bg-sky/12 text-sky",
    success: "bg-success/10 text-success",
    warning: "bg-warning/10 text-warning",
  };
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
      <div className={`grid size-10 place-items-center rounded-xl ${map[tone]}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="text-xl font-extrabold text-foreground">{value}</div>
      </div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-[15px] font-bold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Pill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Secure: "bg-success/10 text-success",
    Patrol: "bg-sky/10 text-sky",
    Alert: "bg-warning/15 text-warning",
  };
  return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${map[status]}`}>{status}</span>;
}
